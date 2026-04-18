import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { IconComponent } from '../icon/ng-icon.component';

export interface NgTreeNode {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  children?: NgTreeNode[];
  selectable?: boolean;
  disabled?: boolean;
  expanded?: boolean;
}

export interface NgTreeSelectionChange {
  selectedIds: string[];
  selectedNodes: NgTreeNode[];
  indeterminateIds: string[];
  allSelected: boolean;
}

interface TreeIndex {
  nodeMap: Map<string, NgTreeNode>;
  parentMap: Map<string, string | null>;
  subtreeSelectableMap: Map<string, string[]>;
  allSelectableIds: string[];
  expandedIds: string[];
}

@Component({
  selector: 'ng-tree',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, IconComponent],
  templateUrl: './ng-tree.component.html',
  styleUrl: './ng-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ng-tree-host',
  },
})
export class NgTreeComponent {
  readonly nodes = input<NgTreeNode[]>([]);
  readonly showCheckboxes = input<boolean>(true);
  readonly cascadeSelection = input<boolean>(true);
  readonly expandAll = input<boolean>(true);
  readonly selectedIds = input<readonly string[]>([]);

  readonly selectionChange = output<NgTreeSelectionChange>();
  readonly selectedIdsChange = output<string[]>();
  readonly nodeClick = output<NgTreeNode>();

  private readonly indexedTree = computed(() => this.buildTreeIndex(this.nodes()));
  private readonly selection = signal<Set<string>>(new Set());
  private readonly expanded = signal<Set<string>>(new Set());

  constructor() {
    effect(() => {
      this.selection.set(this.normalizeSelection(this.selectedIds()));
    });

    effect(() => {
      this.expanded.set(new Set(this.indexedTree().expandedIds));
    });
  }

  readonly selectionState = computed<NgTreeSelectionChange>(() => {
    const tree = this.indexedTree();
    const selectedIds = tree.allSelectableIds.filter((id) => this.selection().has(id));

    return {
      selectedIds,
      selectedNodes: selectedIds
        .map((id) => tree.nodeMap.get(id))
        .filter((node): node is NgTreeNode => !!node),
      indeterminateIds: tree.allSelectableIds.filter((id) => {
        const node = tree.nodeMap.get(id);
        return !!node && this.isIndeterminate(node);
      }),
      allSelected:
        tree.allSelectableIds.length > 0 &&
        tree.allSelectableIds.every((id) => this.selection().has(id)),
    };
  });

  hasChildren(node: NgTreeNode) {
    return !!node.children?.length;
  }

  isExpanded(node: NgTreeNode) {
    return this.expanded().has(node.id);
  }

  isSelectable(node: NgTreeNode) {
    return node.selectable !== false && !node.disabled;
  }

  isChecked(node: NgTreeNode) {
    return this.selection().has(node.id);
  }

  isIndeterminate(node: NgTreeNode) {
    if (!this.hasChildren(node)) {
      return false;
    }

    const selectableIds = this.descendantSelectableIds(node);
    if (!selectableIds.length) {
      return false;
    }

    const selectedCount = selectableIds.filter((id) => this.selection().has(id)).length;
    return selectedCount > 0 && selectedCount < selectableIds.length;
  }

  toggleExpanded(node: NgTreeNode) {
    if (!this.hasChildren(node)) {
      return;
    }

    this.expanded.update((expanded) => {
      const next = new Set(expanded);
      if (next.has(node.id)) {
        next.delete(node.id);
      } else {
        next.add(node.id);
      }
      return next;
    });
  }

  onCheckboxChange(node: NgTreeNode, event: MatCheckboxChange) {
    this.toggleSelection(node, event.checked);
  }

  onNodeLabelClick(node: NgTreeNode) {
    this.nodeClick.emit(node);
  }

  trackNode(_: number, node: NgTreeNode) {
    return node.id;
  }

  childNodes(node: NgTreeNode) {
    return node.children ?? [];
  }

  levelIndent(level: number) {
    return `${level * 20}px`;
  }

  private toggleSelection(node: NgTreeNode, checked: boolean) {
    if (!this.isSelectable(node)) {
      return;
    }

    const next = new Set(this.selection());
    const selectableIds = this.cascadeSelection()
      ? this.descendantSelectableIds(node)
      : [node.id];

    for (const id of selectableIds) {
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
    }

    if (this.cascadeSelection()) {
      this.syncAncestors(node.id, next);
    }

    this.selection.set(next);
    this.selectedIdsChange.emit(this.selectionState().selectedIds);
    this.selectionChange.emit(this.selectionState());
  }

  private syncAncestors(nodeId: string, selection: Set<string>) {
    const tree = this.indexedTree();
    let current = tree.parentMap.get(nodeId) ?? null;

    while (current) {
      const ancestor = tree.nodeMap.get(current);
      if (!ancestor) {
        break;
      }

      if (this.isSelectable(ancestor)) {
        const subtreeIds = tree.subtreeSelectableMap.get(current) ?? [];
        const descendantIds = subtreeIds.filter((id) => id !== current);
        const fullySelected = descendantIds.length
          ? descendantIds.every((id) => selection.has(id))
          : selection.has(current);

        if (fullySelected) {
          selection.add(current);
        } else {
          selection.delete(current);
        }
      }

      current = tree.parentMap.get(current) ?? null;
    }
  }

  private descendantSelectableIds(node: NgTreeNode) {
    return this.indexedTree().subtreeSelectableMap.get(node.id) ?? [];
  }

  private normalizeSelection(selectedIds: readonly string[]) {
    const tree = this.indexedTree();
    const normalized = new Set<string>();

    for (const id of selectedIds) {
      const node = tree.nodeMap.get(id);
      if (!node || !this.isSelectable(node)) {
        continue;
      }

      const nextIds = this.cascadeSelection()
        ? tree.subtreeSelectableMap.get(id) ?? []
        : [id];

      for (const nextId of nextIds) {
        normalized.add(nextId);
      }
    }

    if (this.cascadeSelection()) {
      for (const id of selectedIds) {
        if (tree.nodeMap.has(id)) {
          this.syncAncestors(id, normalized);
        }
      }
    }

    return normalized;
  }

  private buildTreeIndex(nodes: NgTreeNode[]): TreeIndex {
    const nodeMap = new Map<string, NgTreeNode>();
    const parentMap = new Map<string, string | null>();
    const subtreeSelectableMap = new Map<string, string[]>();
    const allSelectableIds: string[] = [];
    const expandedIds: string[] = [];

    const visit = (entries: NgTreeNode[], parentId: string | null): string[] => {
      const selectableIds: string[] = [];

      for (const node of entries) {
        nodeMap.set(node.id, node);
        parentMap.set(node.id, parentId);

        if (this.expandAll() || node.expanded) {
          expandedIds.push(node.id);
        }

        if (this.isSelectable(node)) {
          allSelectableIds.push(node.id);
          selectableIds.push(node.id);
        }

        const childSelectableIds = node.children?.length ? visit(node.children, node.id) : [];

        const ownSelectableIds = this.isSelectable(node) ? [node.id] : [];
        const subtreeIds = [...ownSelectableIds, ...childSelectableIds];
        subtreeSelectableMap.set(node.id, subtreeIds);

        selectableIds.push(...childSelectableIds);
      }

      return selectableIds;
    };

    visit(nodes, null);

    return {
      nodeMap,
      parentMap,
      subtreeSelectableMap,
      allSelectableIds,
      expandedIds,
    };
  }
}
