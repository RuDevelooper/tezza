<script setup>
import "@/assets/sass/apps/invoice-preview.scss";

const props = defineProps({
  order: {},
});
const columns = [
  { key: "sku", label: "Артикул" },
  { key: "title", label: "Наименование" },
  { key: "size", label: "Размер" },
  { key: "side", label: "Сторона" },
  { key: "material", label: "Материал" },
  { key: "color", label: "Цвет" },
  { key: "price", label: "Цена" },
  { key: "discount", label: "Скидка" },
];
</script>

<template>
  <div class="row">
    <div class="col-sm-6 col-12 me-auto">
      <span class="h1">Заказ :</span>
      <span class="h1">
        {{ order.number }}
      </span>
    </div>
    <div v-if="order.customer" class="col-sm-8 align-self-start mt-3">
      <p class="inv-created-date">
        <span class="inv-title">Заказчик : </span>
        <span class="inv-date">
          {{ order.customer.name }}
        </span>
      </p>
      <p class="inv-created-date">
        <span class="inv-title">Организация : </span>
        <span class="inv-date">
          {{ order.customer.organisation }}
        </span>
      </p>
      <p class="inv-created-date">
        <span class="inv-title">Адрес : </span>
        <span class="inv-date">
          {{ order.customer.address }}
        </span>
      </p>
      <p class="inv-created-date">
        <span class="inv-title">Телефон : </span>
        <span class="inv-date">
          {{ order.customer_phone }}
        </span>
      </p>
      <p class="inv-created-date">
        <span class="inv-title">Стоимость изделий : </span>
        <span class="inv-date"> {{ order.products_cost }} руб. </span>
      </p>
      <p class="inv-created-date">
        <span class="inv-title">Стоимость доставки : </span>
        <span class="inv-date"> {{ order.delivery_cost }} руб. </span>
      </p>
      <p class="inv-created-date">
        <span class="inv-title">Скидка : </span>
        <span class="inv-date"> {{ order.discount }} % </span>
      </p>
      <p class="inv-created-date">
        <span class="inv-title">Стоимость заказа : </span>
        <span class="inv-date"> {{ order.total_cost }} руб. </span>
      </p>
      <p class="inv-created-date">
        <span class="inv-title">ТРЕК-номер : </span>
        <span class="inv-date">
          {{ order.delivery_tracking_number }}
        </span>
      </p>
    </div>
    <div class="col-sm-4 align-self-start mt-3 text-sm-end">
      <p v-if="order.designer_user" class="pb-3">
        <span class="inv-subtitle">Дизайнер: </span>
        <span>
          {{ order.designer_user.name }}
        </span>
      </p>
      <p>
        <span>Статус заказа: </span>
        <span>
          {{ order.status }}
        </span>
      </p>
      <p>
        <span>Приоритет: </span>
        <span>
          {{ order.priority }}
        </span>
      </p>
      <p v-if="order.created_by" class="pt-3">
        <span>Менеджер: </span>
        <span>
          {{ order.manager_user.full_name }}
        </span>
      </p>
      <p v-if="order.assembler" class="pt-3">
        <span class="inv-subtitle">Сборщик: </span>
        <span>
          {{ order.assembler_user.full_name }}
        </span>
      </p>
      <p v-if="order.assembling_start">
        <span class="inv-subtitle">Сборка начата: </span>
        <span>
          {{ order.assembling_start.toLocaleDateString("ru-RU") }}
        </span>
      </p>
      <p v-if="order.assembling_end">
        <span class="inv-subtitle">Сборка завершена: </span>
        <span class="text-bold">
          {{ order.assembling_end.toLocaleDateString("ru-RU") }}
        </span>
      </p>
      <p v-if="order.picker" class="pt-3">
        <span class="inv-subtitle">Упаковщик: </span>
        <span>
          {{ order.picker_user.full_name }}
        </span>
      </p>
      <p v-if="order.shipped_at">
        <span class="inv-subtitle">Отправлен: </span>
        <span>
          {{ order.shipped_at.toLocaleDateString("ru-RU") }}
        </span>
      </p>
    </div>
  </div>

  <div class="table-responsive py-3">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Комментарий для менеджера</th>
          <th>Комментарий для сборщика</th>
          <th>Комментарий для упаковщика</th>
          <th>Комментарий для СДЭК</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {{ order.comment_for_manager }}
          </td>
          <td>
            {{ order.comment_for_assembler }}
          </td>
          <td>
            {{ order.comment_for_picker }}
          </td>
          <td>
            {{ order.comment_for_sender }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="table-responsive">
    <table class="table table-hover">
      <thead>
        <tr>
          <th v-for="item in columns" :key="item.key" :class="[item.class]">
            {{ item.label }}
          </th>
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
          <td>{{ item.product.side }} - {{ item.product.side_point }}</td>
          <td>
            {{ item.product.material.title }}
          </td>
          <td>
            {{ item.product.color.title }}
          </td>
          <td>{{ item.price }} руб.</td>
          <td>{{ item.discount }} %</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>