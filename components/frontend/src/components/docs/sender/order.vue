<script setup>
import "@/assets/sass/apps/invoice-print.scss";

const props = defineProps({
  order: {},
});
</script>

<template>
  <div class="row">
    <div class="col-sm-6 col-12 me-auto">
      <strong class="h1">
        {{ order.number }}
      </strong>
    </div>
    <div class="col-sm-6 text-sm-end">
      <div class="">
        <img class="invoice-logo" src="@/assets/images/full_logo.svg" alt="company" />
      </div>
    </div>
    <div v-if="order.customer" class="col-12 align-self-start mt-3">
      <p class="inv-created-date">
        <span class="inv-title">Заказчик : </span>
        <span class="inv-date">
          {{ order.customer.name }}
        </span>
      </p>
      <p v-if="order.customer.organisation != 'сайт'" class="inv-created-date">
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
        <span class="inv-title">Доставку оплачивает : </span>
        <span class="inv-date"> {{ order.delivery_payer_name }}</span>
      </p>
      <p v-if="order.discount > 0" class="inv-created-date">
        <span class="inv-title">Скидка : </span>
        <span class="inv-date"> {{ order.discount }} % </span>
      </p>
      <p class="inv-created-date">
        <span class="inv-title">Стоимость заказа : </span>
        <span class="inv-date"> {{ order.total_cost }} руб. </span>
      </p>
    </div>
  </div>

  <div class="table-responsive">
    <table class="table inv-table">
      <thead>
        <tr>
          <th>Артикул</th>
          <th>Наименование</th>
          <th>Размер</th>
          <th>Сторона</th>
          <th>Материал</th>
          <th>Цвет</th>
          <!-- <th>Цена</th>
          <th>Скидка</th> -->
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
          <!-- <td>
            {{ item.price }}
          </td>
          <td>
            {{ item.discount > 0 ? item.discount : "" }}
          </td> -->
        </tr>
      </tbody>
    </table>
  </div>
</template>