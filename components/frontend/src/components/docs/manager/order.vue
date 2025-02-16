<script setup>
import "@/assets/sass/apps/invoice-print.scss";

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
  // { key: "price", label: "Цена" },
  // { key: "discount", label: "Скидка" },
];
</script>

<template>
  <div class="row">
    <div class="col-sm-6 col-12 me-auto">
      <strong class="h1">
        {{ order.number }}
      </strong>
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
      <div v-if="order.delivery_payer == 'customer'">
        <p class="inv-created-date">
          <span class="inv-title">Стоимость доставки : </span>
          <span class="inv-date"> {{ order.delivery_cost }} руб. </span>
        </p>
        <p class="inv-created-date">
          <span class="inv-title">Доставку оплачивает : </span>
          <span class="inv-date"> {{ order.delivery_payer_name }}</span>
        </p>
      </div>
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
    <div class="col-sm-4 align-self-start pt-3 text-sm-end inv-right-block">
      <p v-if="order.designer_user" class="pb-2 ">
        <span class="inv-subtitle">Дизайнер: </span>
        <span>
          {{
            order.designer_user.name
          }}
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
      <p v-if="order.created_by" class="pt-2">
        <span>Менеджер: </span>
        <strong>
          {{
            order.created_by.full_name
          }}
        </strong>
      </p>
      <p v-if="order.ordered_at">
        <span class="inv-subtitle">Принят:
        </span>
        <span>
          {{
            order.ordered_at.toLocaleDateString(
              "ru-RU"
            )
          }}
        </span>
      </p>
      <p v-if="order.due_date">
        <span class="inv-subtitle">Отправить до:
        </span>
        <span>
          {{
            order.due_date.toLocaleDateString(
              "ru-RU"
            )
          }}
        </span>
      </p>
      <p v-if="order.assembler" class="pt-2">
        <span class="inv-subtitle">Сборщик: </span>
        <span>
          {{
            order.assembler.full_name
          }}
        </span>
      </p>
      <p v-if="order.assembling_start">
        <span class="inv-subtitle">Сборка начата:
        </span>
        <span>
          {{
            order.assembling_start.toLocaleDateString(
              "ru-RU"
            )
          }}
        </span>
      </p>
      <p v-if="order.assembling_end">
        <span class="inv-subtitle">Сборка завершена:
        </span>
        <span>
          {{
            order.assembling_end.toLocaleDateString(
              "ru-RU"
            )
          }}
        </span>
      </p>
      <p v-if="order.picker" class="pt-2">
        <span class="inv-subtitle">Упаковщик: </span>
        <span>
          {{
            order.picker.full_name
          }}
        </span>
      </p>
      <p v-if="order.shipped_at">
        <span class="inv-subtitle">Отправлен: </span>
        <span>
          {{
            order.shipped_at.toLocaleDateString(
              "ru-RU"
            )
          }}
        </span>
      </p>
    </div>
  </div>

  <div class="table-responsive py-3 inv-table">
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Менеджер</th>
          <th>Сборка</th>
          <th>Упаковка</th>
          <th>СДЭК</th>
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

  <div class="table inv-table">
    <table class="table">
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
          <!-- <td>{{ item.price }} руб.</td>
          <td>{{ item.discount }} %</td> -->
        </tr>
      </tbody>
    </table>
  </div>
</template>