document.addEventListener("DOMContentLoaded", function () {
    //Agregar una edición
    let numEdiciones = 1;
    document.querySelector("#addEdition").addEventListener("click", () => {
        let edicionesContainer = document.querySelector("#edicionesContainer");
        let edicion = document.createElement("div");
        edicion.classList.add("input-group");
        edicion.id = "edicion";
        edicion.innerHTML =
            `<input type="text" class="form-control col-6 m-1" name="edicion[]" placeholder="Edición" value="">
            <input type="number" min="2000" max="2023" class="form-control col-6 m-1" name="anyoEdicion[]" placeholder="Año" value="2000">`;
        edicionesContainer.appendChild(edicion);
    });


    //Eliminar el último child
    document.querySelector("#removeEdition").addEventListener("click", () => {
        let edicionesContainer = document.querySelector("#edicionesContainer");
        let edicion = document.querySelector("#edicion");
        let lastChild = edicionesContainer.lastChild;
        edicionesContainer.removeChild(lastChild);
    });
});