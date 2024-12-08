<script setup>
import "@/assets/sass/apps/invoice-preview.scss";

const props = defineProps({
  order: {},
});
</script>

<template>
  <div class="row pb-3">
    <div class="col-sm-6">
      <span class="h1">Заказ :</span>
      <span class="h1">
        {{ order.number }}
      </span>
    </div>
    <div class="col-sm-8 align-self-end mt-3">
      <p class="inv-due-date mt-1">
        <span class="inv-title">Завершить сборку до : </span>
        <span class="inv-date">
          {{ order.assembler_deadline_locale_date }}
        </span>
      </p>
      <p class="inv-due-date mt-1">
        <span class="inv-title">Комментарий: </span>
        <span class="inv-date">
          {{ order.comment_for_assembler }}
        </span>
      </p>
    </div>
    <div class="col-sm-4 align-self-start text-sm-end">
      <p>
        <span class="inv-subtitle">Статус заказа: </span>
        <span>
          {{ order.status }}
        </span>
      </p>
      <p>
        <span class="inv-subtitle">Приоритет: </span>
        <span>
          {{ order.priority }}
        </span>
      </p>
      <p v-if="order.created_by">
        <span class="inv-subtitle">Менеджер: </span>
        <span>
          {{ order.manager_user.full_name }}
        </span>
      </p>
      <p v-if="order.assembler">
        <span class="inv-subtitle">Сборщик: </span>
        <span>
          {{ order.assembler_user.full_name }}
        </span>
      </p>
    </div>
  </div>

  <div class="table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Артикул</th>
          <th>Наименование</th>
          <th>Размер</th>
          <th>Сторона</th>
          <th>Материал</th>
          <th>Цвет</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in order.items" :key="item.id">
          <td>
            {{ item.product.sku }}
          </td>
          <td>
            {{ item.product.title }}
          </td>
          <td>
            {{ item.product.size }}
          </td>
          <td>
            {{ item.product.side }} -
            {{ item.product.side_point }}
          </td>
          <td>
            {{ item.product.material.title }}
          </td>
          <td>
            {{ item.product.color.title }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>