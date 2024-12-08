<script setup>
import { useMeta } from "@/composables/use-meta";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";

import orderTemplate from "@/components/docs/manager/order";

useMeta({ title: "Заказ" });

const route = useRoute();
const store = useStore();
const order = ref({});

const bind_data = () => {
  console.log(store.state.orders.order);
  order.value = store.state.orders.order;
};

onMounted(() => {
  store
    .dispatch("orders/fetchById", { id: route.query.id })
    .then(() => {
      bind_data();
      console.log(order.value);
    })
    .then(() => {
      if (route.query.print === "true") window.print();
    });
});
</script>

<template>
  <div class="invoice-container">
    <div class="invoice-inbox">
      <div id="ct" class="">
        <div class="content-section">
          <orderTemplate :order="order" />
        </div>
      </div>
    </div>
  </div>
</template>
