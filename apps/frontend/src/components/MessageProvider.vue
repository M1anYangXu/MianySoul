<template>
  <router-view />
</template>

<script setup lang="ts">
import { useMessage, useDialog } from "naive-ui";
import { setMessageInstance, setDialogInstance } from "@/composables";

const message = useMessage();
const dialog = useDialog();

setMessageInstance(message);
setDialogInstance(dialog);
</script>
