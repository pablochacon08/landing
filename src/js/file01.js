"use strict";

import { fetchProducts, fetchCategories } from "./functions.js";

/**
 * Carga y renderiza los productos dentro del contenedor principal.
 *
 * Obtiene la información desde un archivo JSON remoto usando la función fetchProducts.
 * Si la respuesta es exitosa, muestra los primeros 6 productos dentro del elemento
 * con id "products-container".
 *
 * @function renderProducts
 * @returns {void} No retorna ningún valor.
 */
const renderProducts = () => {
    fetchProducts("https://data-dawm.github.io/datum/reseller/products.json")
        .then(result => {
            if (result.success) {
                let container = document.getElementById("products-container");
                container.innerHTML = "";

                let products = result.body.slice(0, 6);

                products.forEach(product => {
                    let productHTML = `
                        <div class="space-y-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow">
                            <img
                                class="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded-lg object-cover transition-transform duration-300 hover:scale-[1.03]"
                                src="[PRODUCT.IMGURL]" alt="[PRODUCT.TITLE]">
                            <h3
                                class="h-6 text-xl font-semibold tracking-tight text-gray-900 dark:text-white hover:text-black-600 dark:hover:text-white-400">
                                $[PRODUCT.PRICE]
                            </h3>
                            <div class="h-5 rounded w-full">[PRODUCT.TITLE]</div>
                            <div class="space-y-2">
                                <a href="[PRODUCT.PRODUCTURL]" target="_blank" rel="noopener noreferrer"
                                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-full inline-block">
                                    Ver en Amazon
                                </a>
                                <div class="hidden"><span class="1">[PRODUCT.CATEGORY_ID]</span></div>
                            </div>
                        </div>`;

                    productHTML = productHTML.replaceAll(
                        "[PRODUCT.TITLE]",
                        product.title.length > 20 ? product.title.substring(0, 20) + "..." : product.title
                    );

                    productHTML = productHTML.replaceAll("[PRODUCT.IMGURL]", product.imgUrl);
                    productHTML = productHTML.replaceAll("[PRODUCT.PRICE]", product.price);
                    productHTML = productHTML.replaceAll("[PRODUCT.PRODUCTURL]", product.productUrl);
                    productHTML = productHTML.replaceAll("[PRODUCT.CATEGORY_ID]", product.category_id);

                    container.innerHTML += productHTML;
                });
            } else {
                alert(result.body);
            }
        });
};

/**
 * Carga y muestra las categorías dentro del elemento select.
 *
 * Obtiene las categorías desde un archivo XML remoto usando la función fetchCategories.
 * Si la respuesta es exitosa, extrae los valores de id y name de cada elemento category
 * y los agrega como opciones HTML dentro del select con id "categories".
 *
 * @async
 * @function renderCategories
 * @returns {Promise<void>} No retorna ningún valor.
 */
const renderCategories = async () => {
    try {
        const result = await fetchCategories("https://data-dawm.github.io/datum/reseller/categories.xml");

        if (result.success === true) {
            const container = document.getElementById("categories");

            container.innerHTML = `<option selected disabled>Seleccione una categoría</option>`;

            const categoriesXML = result.body;
            const categories = categoriesXML.getElementsByTagName("category");

            for (let category of categories) {
                const id = category.getElementsByTagName("id")[0].textContent;
                const name = category.getElementsByTagName("name")[0].textContent;

                let categoryHTML = `<option value="${id}">${name}</option>`;

                container.innerHTML += categoryHTML;
            }
        } else {
            alert(result.body);
        }
    } catch (error) {
        alert(error.message);
    }
};

/**
 * Muestra el toast interactivo en la pantalla.
 *
 * Busca el elemento con id "toast-interactive" y modifica sus clases
 * para hacerlo visible.
 *
 * @function showToast
 * @returns {void} No retorna ningún valor.
 */
const showToast = () => {
    const toast = document.getElementById("toast-interactive");

    if (toast) {
        toast.classList.add("md:block");
        toast.classList.remove("md:hidden");
    }
};

/**
 * Configura el botón de demostración para abrir un video externo.
 *
 * Busca el elemento con id "demo" y le agrega un evento click
 * para abrir un video de YouTube en una nueva pestaña.
 *
 * @function showVideo
 * @returns {void} No retorna ningún valor.
 */
const showVideo = () => {
    const demo = document.getElementById("demo");

    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
};

/**
 * Ejecuta las funciones principales cuando se carga el módulo.
 *
 * Llama a las funciones encargadas de mostrar el toast, configurar el video,
 * cargar los productos y cargar las categorías.
 *
 * @function
 * @returns {void} No retorna ningún valor.
 */
(() => {
    showToast();
    showVideo();
    renderProducts();
    renderCategories();
})();