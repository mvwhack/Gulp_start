import $ from "jquery";
import svg4everybody from "svg4everybody";
import baguetteBox from "baguettebox.js";

import {
    modals
} from "./modules/modals";

$(function () {
    svg4everybody();
    checkWebp();
    modals();
});
