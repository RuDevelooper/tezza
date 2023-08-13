<script setup>
import { onMounted, ref } from 'vue';

import '@/assets/sass/scrollspyNav.scss';
import '@/assets/sass/tables/table-basic.scss';
import highlight from '@/components/plugins/highlight.vue';

import { useMeta } from '@/composables/use-meta';
useMeta({ title: 'Tables' });

const code_arr = ref([]);
const table_1 = ref([]);
const table_2 = ref([]);

onMounted(() => {
    initTooltip();
    init_tables();
});

const toggleCode = (name) => {
    if (code_arr.value.includes(name)) {
        code_arr.value = code_arr.value.filter((d) => d != name);
    } else {
        code_arr.value.push(name);
    }
};

const initTooltip = () => {
    setTimeout(() => {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map((tooltipTriggerEl) => {
            return new window.bootstrap.Tooltip(tooltipTriggerEl);
        });
    });
};

const init_tables = () => {
    table_1.value = [
        {
            thumb: 'boy.png',
            name: 'Shaun Park',
            'first name': 'John',
            'last name': 'Doe',
            email: 'johndoe@yahoo.com',
            date: '10/08/2020',
            sale: '320',
            sales: '29.56',
            status: 'Complete',
            status_class: 'success',
            register: '5 min ago',
            position: 'Developer',
            office: 'London',
        },
        {
            thumb: 'girl-1.png',
            name: 'Alma Clarke',
            'first name': 'Andy',
            'last name': 'King',
            email: 'andyking@gmail.com',
            date: '11/08/2020',
            sale: '420',
            sales: '19.15',
            status: 'Pending',
            status_class: 'secondary',
            register: '10 min ago',
            position: 'Designer',
            office: 'New York',
        },
        {
            thumb: 'girl-2.png',
            name: 'Xavier',
            'first name': 'Lisa',
            'last name': 'Doe',
            email: 'lisadoe@yahoo.com',
            date: '12/08/2020',
            sale: '130',
            sales: '39.00',
            status: 'In progress',
            status_class: 'info',
            register: '1 hour ago',
            position: 'Accountant',
            office: 'Amazon',
        },
        {
            thumb: 'boy-2.png',
            name: 'Vincent Carpenter',
            'first name': 'Vincent',
            'last name': 'Carpenter',
            email: 'vinnyc@yahoo.com',
            date: '13/08/2020',
            sale: '260',
            sales: '88.03',
            status: 'Canceled',
            status_class: 'danger',
            register: '1 day ago',
            position: 'Data Scientist',
            office: 'Canada',
        },
        {
            thumb: 'boy.png',
            name: 'Shaun Park',
            'first name': 'John',
            'last name': 'Doe',
            email: 'johndoe@yahoo.com',
            date: '10/08/2020',
            sale: '320',
            sales: '29.56',
            status: 'Complete',
            status_class: 'success',
            register: '5 min ago',
            position: 'Developer',
            office: 'London',
        },
        {
            thumb: 'girl-1.png',
            name: 'Alma Clarke',
            'first name': 'Andy',
            'last name': 'King',
            email: 'andyking@gmail.com',
            date: '11/08/2020',
            sale: '420',
            sales: '19.15',
            status: 'Pending',
            status_class: 'secondary',
            register: '10 min ago',
            position: 'Designer',
            office: 'New York',
        },
        {
            thumb: 'girl-2.png',
            name: 'Xavier',
            'first name': 'Lisa',
            'last name': 'Doe',
            email: 'lisadoe@yahoo.com',
            date: '12/08/2020',
            sale: '130',
            sales: '39.00',
            status: 'In progress',
            status_class: 'info',
            register: '1 hour ago',
            position: 'Accountant',
            office: 'Amazon',
        },
        {
            thumb: 'boy-2.png',
            name: 'Vincent Carpenter',
            'first name': 'Vincent',
            'last name': 'Carpenter',
            email: 'vinnyc@yahoo.com',
            date: '13/08/2020',
            sale: '260',
            sales: '88.03',
            status: 'Canceled',
            status_class: 'danger',
            register: '1 day ago',
            position: 'Data Scientist',
            office: 'Canada',
        },
        {
            thumb: 'boy.png',
            name: 'Shaun Park',
            'first name': 'John',
            'last name': 'Doe',
            email: 'johndoe@yahoo.com',
            date: '10/08/2020',
            sale: '320',
            sales: '29.56',
            status: 'Complete',
            status_class: 'success',
            register: '5 min ago',
            position: 'Developer',
            office: 'London',
        },
        {
            thumb: 'girl-1.png',
            name: 'Alma Clarke',
            'first name': 'Andy',
            'last name': 'King',
            email: 'andyking@gmail.com',
            date: '11/08/2020',
            sale: '420',
            sales: '19.15',
            status: 'Pending',
            status_class: 'secondary',
            register: '10 min ago',
            position: 'Designer',
            office: 'New York',
        },
        {
            thumb: 'girl-2.png',
            name: 'Xavier',
            'first name': 'Lisa',
            'last name': 'Doe',
            email: 'lisadoe@yahoo.com',
            date: '12/08/2020',
            sale: '130',
            sales: '39.00',
            status: 'In progress',
            status_class: 'info',
            register: '1 hour ago',
            position: 'Accountant',
            office: 'Amazon',
        },
        {
            thumb: 'boy-2.png',
            name: 'Vincent Carpenter',
            'first name': 'Vincent',
            'last name': 'Carpenter',
            email: 'vinnyc@yahoo.com',
            date: '13/08/2020',
            sale: '260',
            sales: '88.03',
            status: 'Canceled',
            status_class: 'danger',
            register: '1 day ago',
            position: 'Data Scientist',
            office: 'Canada',
        },
    ];

    table_2.value = [
        {
            thumb: 'boy.png',
            name: 'Amy Diaz',
            'first name': 'Amy',
            'last name': 'Diaz',
            email: 'amydiaz@yahoo.com',
            date: '10/08/2020',
            sale: '320',
            sales: '29.56',
            status: 'Complete',
            status_class: 'success',
            register: '5 min ago',
        },
        {
            thumb: 'girl-1.png',
            name: 'Nia Hillyer',
            'first name': 'Nia',
            'last name': 'Hillyer',
            email: 'niahill@gmail.com',
            date: '11/08/2020',
            sale: '420',
            sales: '19.15',
            status: 'Pending',
            status_class: 'secondary',
            register: '10 min ago',
        },
        {
            thumb: 'girl-2.png',
            name: 'Marry',
            'first name': 'Marry',
            'last name': 'McDonald',
            email: 'marryMcD@yahoo.com',
            date: '12/08/2020',
            sale: '130',
            sales: '39.00',
            status: 'In progress',
            status_class: 'info',
            register: '1 hour ago',
        },
        {
            thumb: 'boy-2.png',
            name: 'Shaun Park',
            'first name': 'Shaun',
            'last name': 'Park',
            email: 'park@yahoo.com',
            date: '13/08/2020',
            sale: '260',
            sales: '88.03',
            status: 'Canceled',
            status_class: 'danger',
            register: '1 day ago',
        },
    ];
    table_2.value = table_1.value.concat(table_2.value);
};

const random_class = (index) => {
    if (index == 0) {
        return 'default';
    } else if (index == 1) {
        return 'primary';
    } else if (index == 2) {
        return 'secondary';
    } else if (index == 3) {
        return 'success';
    } else if (index == 4) {
        return 'dark';
    } else if (index == 5) {
        return 'danger';
    } else if (index == 6) {
        return 'info';
    } else if (index == 7) {
        return 'warning';
    }
    return 'dark';
};
</script>

<template>
    <div class="layout-px-spacing dash_1">
        <teleport to="#breadcrumb">
            <ul class="navbar-nav flex-row">
                <li>
                    <div class="page-header">
                        <nav class="breadcrumb-one" aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="javascript:;">Tables</a></li>
                                <li class="breadcrumb-item active" aria-current="page"><span>Basic</span></li>
                            </ol>
                        </nav>
                    </div>
                </li>
            </ul>
        </teleport>
        <div class="row layout-top-spacing">

            <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
                <div class="statbox panel box box-shadow">
                    <div class="panel-heading">
                        <div class="row">
                            <div class="col-xl-12 col-md-12 col-sm-12 col-12">
                                <h4>Мои заказы</h4>
                            </div>
                        </div>
                    </div>
                    <div class="panel-body">
                        <div class="table-responsive">
                            <table role="table" aria-busy="false" aria-colcount="5" class="table b-table" id="__BVID__319">
                                <thead role="rowgroup" class="">
                                    <tr role="row" class="">
                                        <th role="columnheader" scope="col" aria-colindex="1" class="">
                                            <div>#</div>
                                        </th>
                                        <th role="columnheader" scope="col" aria-colindex="2" class="">
                                            <div>Name</div>
                                        </th>
                                        <th role="columnheader" scope="col" aria-colindex="3" class="">
                                            <div>Email</div>
                                        </th>
                                        <th role="columnheader" scope="col" aria-colindex="4" class="">
                                            <div>Status</div>
                                        </th>
                                        <th role="columnheader" scope="col" aria-colindex="5" class="">
                                            <div>Register</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody role="rowgroup">
                                    <tr v-for="(item, i) in table_1" :key="item.name" role="row" class="">
                                        <td aria-colindex="1" role="cell" class="">{{ i + 1 }}</td>
                                        <td aria-colindex="2" role="cell" class="text-success">{{ item.name }}</td>
                                        <td aria-colindex="3" role="cell" class="">{{ item.email }}</td>
                                        <td aria-colindex="4" role="cell" class="">
                                            <span class="badge" :class="{
                                                'outline-badge-primary': item.status == 'Complete',
                                                'outline-badge-secondary': item.status == 'Pending',
                                                'outline-badge-info': item.status == 'In progress',
                                                'outline-badge-danger': item.status == 'Canceled',
                                            }">
                                                {{ item.status }}
                                            </span>
                                        </td>
                                        <td aria-colindex="5" role="cell" class="">{{ item.register }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
                <div class="statbox panel box box-shadow">
                    <div class="panel-heading">
                        <div class="row">
                            <div class="col-xl-12 col-md-12 col-sm-12 col-12">
                                <h4>Все заказы</h4>
                            </div>
                        </div>
                    </div>
                    <div class="panel-body">
                        <div class="table-responsive">
                            <table role="table" aria-busy="false" aria-colcount="5" class="table b-table" id="__BVID__319">
                                <thead role="rowgroup" class="">
                                    <tr role="row" class="">
                                        <th role="columnheader" scope="col" aria-colindex="1" class="">
                                            <div>#</div>
                                        </th>
                                        <th role="columnheader" scope="col" aria-colindex="2" class="">
                                            <div>Name</div>
                                        </th>
                                        <th role="columnheader" scope="col" aria-colindex="3" class="">
                                            <div>Email</div>
                                        </th>
                                        <th role="columnheader" scope="col" aria-colindex="4" class="">
                                            <div>Status</div>
                                        </th>
                                        <th role="columnheader" scope="col" aria-colindex="5" class="">
                                            <div>Register</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody role="rowgroup">
                                    <tr v-for="(item, i) in table_1" :key="item.name" role="row" class="">
                                        <td aria-colindex="1" role="cell" class="">{{ i + 1 }}</td>
                                        <td aria-colindex="2" role="cell" class="text-success">{{ item.name }}</td>
                                        <td aria-colindex="3" role="cell" class="">{{ item.email }}</td>
                                        <td aria-colindex="4" role="cell" class="">
                                            <span class="badge" :class="{
                                                'outline-badge-primary': item.status == 'Complete',
                                                'outline-badge-secondary': item.status == 'Pending',
                                                'outline-badge-info': item.status == 'In progress',
                                                'outline-badge-danger': item.status == 'Canceled',
                                            }">
                                                {{ item.status }}
                                            </span>
                                        </td>
                                        <td aria-colindex="5" role="cell" class="">{{ item.register }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>