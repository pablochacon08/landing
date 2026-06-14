'use strict';

/**
 * Obtiene productos desde una URL en formato JSON.
 *
 * Realiza una petición HTTP usando fetch, valida que la respuesta sea correcta
 * y devuelve un objeto con el estado de la operación y los datos obtenidos.
 *
 * @function fetchProducts
 * @param {string} url - URL desde donde se obtendrán los productos.
 * @returns {Promise<{success: boolean, body: Object|string}>} Promesa con el resultado de la petición.
 */
let fetchProducts = (url) => {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            return response.json();
        })
        .then(data => {
            return {
                success: true,
                body: data
            };
        })
        .catch(error => {
            return {
                success: false,
                body: error.message
            };
        });
};

/**
 * Obtiene categorías desde una URL en formato XML.
 *
 * Realiza una petición HTTP usando fetch, convierte la respuesta de texto
 * a un documento XML mediante DOMParser y devuelve un objeto con el estado
 * de la operación y los datos obtenidos.
 *
 * @async
 * @function fetchCategories
 * @param {string} url - URL desde donde se obtendrán las categorías en formato XML.
 * @returns {Promise<{success: boolean, body: Document|string}>} Promesa con el resultado de la petición.
 */
let fetchCategories = async (url) => {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        let text = await response.text();

        const parser = new DOMParser();
        const data = parser.parseFromString(text, 'application/xml');

        return {
            success: true,
            body: data
        };

    } catch (error) {
        return {
            success: false,
            body: error.message
        };
    }
};

export { fetchCategories, fetchProducts };