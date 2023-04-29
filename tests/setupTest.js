import "@testing-library/jest-dom";
import '@testing-library/jest-dom';
import i18n from '../src/i18n/i18n';
import {render, screen} from "@testing-library/vue";
import App from "@/App.vue";

afterEach(function () {
    i18n.locale = 'en'
});