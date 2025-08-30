# 📘 Proyecto: Gestión de Clientes

Aplicación web desarrollada con **React + TypeScript + Tailwind CSS**, orientada a la gestión de clientes. Permite registrar, editar, eliminar y visualizar clientes, además de exportar la información en formato **PDF** y **Excel**.

---

## 🚀 Tecnologías utilizadas

- **React 19** – Librería principal para la interfaz
- **TypeScript** – Tipado estático para mayor robustez
- **Tailwind CSS v4** – Estilos modernos y responsivos
- **React Hook Form + Zod** – Validación de formularios
- **React Router DOM** – Navegación entre páginas
- **SweetAlert2** – Alertas visuales para confirmaciones
- **React Toastify** – Notificaciones no intrusivas
- **React-to-PDF** – Exportación de contenido visible a PDF
- **SheetJS (xlsx)** – Exportación de datos a Excel
- **Heroicons** – Íconos SVG integrados

---

## 📦 Instalación

```bash
git clone https://github.com/tu-usuario/cliente-app.git
cd cliente-app
npm install
npm run dev

📋 Funcionalidades

✅ Registro y edición de clientes

✅ Eliminación con confirmación visual

✅ Paginación dinámica

✅ Exportación a PDF del listado visible

✅ Exportación a Excel excluyendo campos sensibles (password, createdAt)

✅ Validación de formularios con mensajes de error

✅ Diseño responsive para móviles y escritorio

📄 Exportación a PDF
El listado de clientes se exporta en formato horizontal, con saltos visuales cada 22 filas para evitar cortes. El contenido se genera desde un contenedor oculto (position: absolute; left: -9999px) para evitar duplicación en pantalla.

📊 Exportación a Excel
Se utiliza SheetJS para generar un archivo .xlsx con los siguientes campos:

ID
Nombre
Apellido
Email
Teléfono
Usuario
Campos como password y createdAt son excluidos por seguridad.

🛡️ Seguridad
Los formularios están validados con Zod

La eliminación de clientes requiere confirmación con SweetAlert2

La exportación filtra datos sensibles