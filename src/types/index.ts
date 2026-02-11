export enum RecordEnum {
  local,
  ldap,
}

export enum RecordEnumRu {
  "Локальная",
  "LDAP",
}

export interface Tag {
  text: string;
}

export interface Record {
  tag: Tag[];
  record: RecordEnum;
  login: string;
  password?: string | null | undefined;
}

export interface FormRecord {
  tag: string;
  record: RecordEnum;
  login: string;
  password?: string | null | undefined;
}
