import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { RecordEnum, type FormRecord, type Record } from "@/types";

export const formStore = defineStore("formStore", () => {
  const formData = useStorage<Record[]>("form", []);

  function getFormData(): FormRecord[] {
    return formData.value.map((obj) => ({
      ...obj,
      tag: obj?.tag?.map((x) => x.text).join(";"),
    }));
  }

  function setFormData(rawData: FormRecord[]) {
    const data = rawData
      .filter(
        ({ login, record, password }) =>
          login && (record === RecordEnum.ldap || password)
      )
      .map((obj) => {
        const arr = obj.tag
          .split(";")
          .map((x) => x.trim())
          .filter((x) => x.length > 0);

        return {
          ...obj,
          tag: arr.map((x) => ({ text: x })),
          password: obj.record === RecordEnum.ldap ? null : obj.password,
        };
      });

    formData.value = data;
  }

  return {
    formData,
    getFormData,
    setFormData,
  };
});
