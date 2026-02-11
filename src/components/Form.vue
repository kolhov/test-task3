<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { formStore } from "@/stores/form";
import { storeToRefs } from "pinia";
import { RecordEnum, RecordEnumRu, type FormRecord } from "@/types";
import { watchDebounced } from "@vueuse/core";

const store = formStore();
const { setFormData, getFormData } = store;
const formRef = ref();

const dynamicValidateForm = reactive<{ data: FormRecord[] }>({
  data: getFormData(),
});

const recordOptions = Object.keys(RecordEnum)
  .filter((x) => !isNaN(Number(x)))
  .map((x, i) => ({ label: RecordEnumRu[Number(x)], value: Number(x) }));

const removeDomain = (index: number) => {
  if (index !== -1) {
    dynamicValidateForm.data.splice(index, 1);
  }
};
const addDomain = () => {
  dynamicValidateForm.data.push({
    tag: "",
    record: RecordEnum.local,
    login: "",
    password: null,
  });
};

const save = () => {
  formRef.value.validate();
  setFormData(dynamicValidateForm.data);
};

watchDebounced(
  dynamicValidateForm,
  () => {
    setFormData(dynamicValidateForm.data);
  },
  { debounce: 600 }
);
</script>

<template>
  <div class="form-wrap">
    <div class="form-header">
      <h1>Учетные записи</h1>
      <a-button @click="addDomain">
        <PlusOutlined />
      </a-button>
      <a-button type="primary" @click="save"> Сохранить </a-button>
    </div>
    <a-alert
      message="Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;"
      type="info"
      show-icon
      class="alert"
    />
    <a-form
      ref="formRef"
      layout="vertical"
      name="dynamic_form_item"
      :model="dynamicValidateForm"
      class="form"
    >
      <a-space v-for="(data, index) in dynamicValidateForm.data" :key="index">
        <a-form-item
          :name="['data', index, 'tag']"
          :label="index === 0 ? 'Метки' : ''"
          class="form__tag"
        >
          <a-input
            v-model:value="data.tag"
            :maxlength="50"
            placeholder="Значение"
          />
        </a-form-item>
        <a-form-item
          :name="['data', index, 'record']"
          :label="index === 0 ? 'Тип записи' : ''"
          class="form__record"
        >
          <a-select
            v-model:value="data.record"
            :defaultvalue="RecordEnum.local"
            :options="recordOptions"
            placeholder="Значение"
          />
        </a-form-item>
        <a-form-item
          :name="['data', index, 'login']"
          :label="index === 0 ? 'Логин' : ''"
          :rules="{
            required: true,
            message: '',
            trigger: 'blur',
          }"
        >
          <a-input
            v-model:value="data.login"
            :style="{
              width: data.record === RecordEnum.ldap ? '444px' : '',
              transition: 'none',
            }"
            :maxlength="100"
            placeholder="Значение"
            class="form__input"
          />
        </a-form-item>
        <a-form-item
          v-if="data.record === RecordEnum.local"
          :name="['data', index, 'password']"
          :label="index === 0 ? 'Пароль' : ''"
          :rules="{
            required: true,
            message: '',
            trigger: 'blur',
          }"
        >
          <a-input-password
            v-model:value="data.password"
            :maxlength="100"
            placeholder="Пароль"
            class="form__input"
          />
        </a-form-item>
        <DeleteOutlined
          class="dynamic-delete-button"
          :style="{ top: index === 0 ? '6px' : '' }"
          @click="removeDomain(index)"
        />
      </a-space>
    </a-form>
  </div>
</template>

<style lang="scss">
.form-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
}
h1 {
  margin: 0;
}
.form {
  width: 60vw;

  &-wrap {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
  &__record {
    width: 168px;
  }

  &__input {
    min-width: 218px;
  }

  &__tag {
    min-width: 218px;
  }
}
.alert {
  margin-bottom: 18px;
}
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  bottom: 10px;
  font-size: 18px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
