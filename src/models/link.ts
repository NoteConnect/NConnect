import { ILinkUI } from "../interfaces";

export default class Link {
  private _id: string;
  private _from: string;
  private _to: string;
  private _data: any;
  private _ui: ILinkUI;

  constructor(from: string, to: string, data: any) {
    this._from = from;
    this._to = to;
    this._data = data;
    this._id = `${this._from} -> ${this._to}`;
  }

  public get id(): string {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }

  public get from(): string {
    return this._from;
  }

  public set from(value: string) {
    this._from = value;
  }

  public get to(): string {
    return this._to;
  }

  public set to(value: string) {
    this._to = value;
  }

  public get data(): any {
    return this._data;
  }

  public set data(value: any) {
    this._data = value;
  }

  public get ui(): ILinkUI {
    return this._ui;
  }

  public set ui(value: ILinkUI) {
    this._ui = value;
  }
}
