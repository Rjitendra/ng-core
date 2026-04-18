import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgTreeComponent, NgTreeNode } from './ng-tree.component';

describe('NgTreeComponent', () => {
  let component: NgTreeComponent;
  let fixture: ComponentFixture<NgTreeComponent>;

  const nodes: NgTreeNode[] = [
    {
      id: 'workspace',
      label: 'Workspace',
      children: [
        {
          id: 'apps',
          label: 'Apps',
          children: [
            { id: 'admin', label: 'Admin' },
            { id: 'portal', label: 'Portal' },
          ],
        },
        {
          id: 'docs',
          label: 'Docs',
          selectable: false,
          children: [{ id: 'guides', label: 'Guides' }],
        },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgTreeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgTreeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('nodes', nodes);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('selecting a parent selects all selectable descendants', () => {
    component.onCheckboxChange(nodes[0], { checked: true } as never);

    expect(component.selectionState().selectedIds).toEqual([
      'workspace',
      'apps',
      'admin',
      'portal',
      'guides',
    ]);
    expect(component.selectionState().allSelected).toBe(true);
  });

  it('selecting all children individually promotes the parent selection', () => {
    const apps = nodes[0].children?.[0];
    const admin = apps?.children?.[0];
    const portal = apps?.children?.[1];

    component.onCheckboxChange(admin!, { checked: true } as never);
    component.onCheckboxChange(portal!, { checked: true } as never);

    expect(component.selectionState().selectedIds).toContain('apps');
    expect(component.isIndeterminate(nodes[0])).toBe(true);
  });

  it('marks a parent indeterminate when only part of its subtree is selected', () => {
    const admin = nodes[0].children?.[0].children?.[0];

    component.onCheckboxChange(admin!, { checked: true } as never);

    expect(component.isIndeterminate(nodes[0])).toBe(true);
    expect(component.isIndeterminate(nodes[0].children?.[0]!)).toBe(true);
  });

  it('respects cascadeSelection=false for isolated selection', () => {
    fixture.componentRef.setInput('cascadeSelection', false);
    fixture.detectChanges();

    component.onCheckboxChange(nodes[0], { checked: true } as never);

    expect(component.selectionState().selectedIds).toEqual(['workspace']);
  });
});
