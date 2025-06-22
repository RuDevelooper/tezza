import { createStore } from 'vuex';
import i18n from '../i18n';

import auth from './auth';
import password from './password';
import signup from './signup';
import orders from './orders';
import order_items from './order_items';
import users from './users';
import products from './products';
import materials from './materials';
import colors from './colors';
import designers from './designers';
import sides from './sides';
import chart from './chart';

export default new createStore({
    state: {
        layout: 'app',
        is_show_sidebar: true,
        is_show_search: false,
        is_dark_mode: false,
        dark_mode: 'light',
        locale: null,
        menu_style: 'vertical',
        layout_style: 'full',
        countryList: [
            { code: 'ru', name: 'Russian' },
            { code: 'en', name: 'English' },
        ],
    },
    mutations: {
        setLayout(state, payload) {
            state.layout = payload;
        },
        toggleSideBar(state, value) {
            state.is_show_sidebar = value;
            localStorage.setItem('is_show_sidebar', value);
        },
        toggleSearch(state, value) {
            state.is_show_search = value;
        },
        toggleLocale(state, value) {
            value = value || 'ru';
            i18n.global.locale = value;
            localStorage.setItem('i18n_locale', value);
            state.locale = value;
        },

        toggleDarkMode(state, value) {
            //light|dark|system
            value = value || 'light';
            localStorage.setItem('dark_mode', value);
            state.dark_mode = value;
            if (value == 'light') {
                state.is_dark_mode = false;
            } else if (value == 'dark') {
                state.is_dark_mode = true;
            } else if (value == 'system') {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    state.is_dark_mode = true;
                } else {
                    state.is_dark_mode = false;
                }
            }

            if (state.is_dark_mode) {
                document.querySelector('body').classList.add('dark');
            } else {
                document.querySelector('body').classList.remove('dark');
            }
        },

        toggleMenuStyle(state, value) {
            //horizontal|vertical|collapsible-vertical
            value = value || '';
            localStorage.setItem('menu_style', value);
            state.menu_style = value;
            if (!value || value === 'vertical') {
                state.is_show_sidebar = false;
            } else if (value === 'collapsible-vertical') {
                state.is_show_sidebar = false;
            }
        },

        toggleLayoutStyle(state, value) {
            //boxed-layout|large-boxed-layout|full
            value = value || '';
            localStorage.setItem('layout_style', value);
            state.layout_style = value;
        },
    },
    getters: {
        layout(state) {
            return state.layout;
        },
    },
    actions: {},
    modules: {
        auth,
        password,
        signup,
        orders,
        order_items,
        products,
        materials,
        colors,
        designers,
        sides,
        users,
        chart,
      },
});
