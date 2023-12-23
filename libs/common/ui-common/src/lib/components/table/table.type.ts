export type IColumn<T> = {
  property: string;
  label: string;
  // refactor types
  type:
    | 'text'
    | 'image'
    | 'stackAvatars'
    | 'color'
    | 'checkbox'
    | 'button'
    | 'toggle'
    | 'contact';
  visible?: boolean;
  cssClasses?: string[];
  // mechanism?: IColumnMechanism;
};

export type IActionName = 'create' | 'edit' | 'detail' | 'delete';

export type IEmittedAction<T> = {
  actionName: IActionName;
  type?: T;
};

export type IAction = {
  name: IActionName;
  event: IEvent;
};

export type IToggle<T> = {
  rowType: T;
  checked: boolean;
  columnName: string;
};

// helpers not exported

type IEvent = {
  label: ILabel;
  icon: IIcon;
};

// add others if exists
type ILabel = 'Edit' | 'Details' | 'Delete';
type IIcon = {
  name: string;
  color?: string;
};
