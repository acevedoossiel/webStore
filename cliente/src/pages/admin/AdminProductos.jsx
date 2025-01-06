import React, { useState, useEffect } from 'react';
import { MdAddCircle, MdEdit, MdDelete } from "react-icons/md";
import styles from './AdminProducts.module.css';


const AdminProductos = () => {
 const [products, setProducts] = useState([]);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [editMode, setEditMode] = useState(false);
 const [currentProductId, setCurrentProductId] = useState(null);
 const [deleteModalOpen, setDeleteModalOpen] = useState(false);
 const [productToDelete, setProductToDelete] = useState(null);
 const [newProduct, setNewProduct] = useState({
   brand: '',
   modelo: '',
   description: '',
   srcImage: [],
   price: '',
   capacity: '',
   flavors: [],
   newFlavor: '',
 });
 const [setSelectedImage] = useState(null);


 useEffect(() => {
   const fetchProducts = async () => {
     try {
       const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/get`);
       if (!response.ok) {
         throw new Error('Error al obtener los productos');
       }
       const data = await response.json();
       setProducts(data);
     } catch (error) {
       console.error('Error al obtener los productos:', error);
     }
   };
   fetchProducts();
 }, []);


 const toggleModal = (product = null) => {
   if (!isModalOpen) {
     if (product) {
       console.log('Asignando producto a editar:', product); // Debug
       setNewProduct({
         brand: product.brand,
         modelo: product.modelo,
         description: product.description,
         srcImage: product.srcImage || [],
         price: product.price?.toString() || '',
         capacity: product.capacity?.toString() || '',
         flavors: product.flavors || [],
         newFlavor: '',
       });
       setEditMode(true);
       setCurrentProductId(product._id || null);
     } else {
       setNewProduct({
         brand: '',
         modelo: '',
         description: '',
         srcImage: [],
         price: '',
         capacity: '',
         flavors: [],
         newFlavor: '',
       });
       setEditMode(false);
       setCurrentProductId(null);
     }
   }
   console.log('Estado del Modal:', !isModalOpen); // Debug
   setIsModalOpen(!isModalOpen);
 };




 const toggleDeleteModal = (productId = null) => {
   setProductToDelete(productId);
   setDeleteModalOpen(!deleteModalOpen);
 };


 const handleInputChange = (e) => {
   const { name, value } = e.target;
   setNewProduct((prev) => ({ ...prev, [name]: value }));
 };


 const handleTemporaryImageAdd = (file) => {
   const tempImageUrl = URL.createObjectURL(file);
   setNewProduct((prev) => ({
     ...prev,
     srcImage: [...prev.srcImage, tempImageUrl],
   }));
 };


 const handleFileChange = (e) => {
   const file = e.target.files[0];
   if (file) {
     handleTemporaryImageAdd(file);
     setSelectedImage(file); // Mantiene la última imagen seleccionada para subirla al servidor después
   }
 };


//  const handleAddImage = async () => {
//    console.log('Current Product ID antes de enviar:', currentProductId); // Debug
//    if (!selectedImage || !currentProductId) {
//      console.error('No se seleccionó una imagen o el ID del producto no es válido.');
//      return;
//    }
//     const formData = new FormData();
//    formData.append('image', selectedImage);
//     try {
//      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/addImage/${currentProductId}`, {
//        method: 'POST',
//        body: formData,
//      });
//       if (!response.ok) {
//        throw new Error('Error al agregar la imagen');
//      }
//       const updatedProduct = await response.json();
//      setNewProduct((prev) => ({ ...prev, srcImage: updatedProduct.data.srcImage }));
//      setProducts((prev) =>
//        prev.map((product) =>
//          product._id === updatedProduct.data._id ? updatedProduct.data : product
//        )
//      );
//      console.log("Imagen agregada correctamente al producto:", currentProductId);
//    } catch (error) {
//      console.error('Error al agregar la imagen:', error);
//    }
//  };
 


//  const handleRemoveImage = async (imageUrl) => {
//    try {
//      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/removeImage/${currentProductId}`, {
//        method: 'POST',
//        headers: { 'Content-Type': 'application/json' },
//        body: JSON.stringify({ imageUrl }),
//      });


//      if (!response.ok) {
//        throw new Error('Error al eliminar la imagen');
//      }


//      const updatedProduct = await response.json();
//      setNewProduct((prev) => ({ ...prev, srcImage: updatedProduct.data.srcImage }));
//      setProducts((prev) =>
//        prev.map((product) =>
//          product._id === updatedProduct.data._id ? updatedProduct.data : product
//        )
//      );
//    } catch (error) {
//      console.error('Error al eliminar la imagen:', error);
//    }
//  };


 const handleAddProduct = async () => {
   try {
     const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ ...newProduct, srcImage: [] }), // Crea el producto sin imágenes inicialmente
     });
      if (!response.ok) {
       throw new Error('Error al agregar el producto');
     }
      const addedProduct = await response.json();
      // Subir las imágenes seleccionadas temporalmente
     for (const tempImage of newProduct.srcImage) {
       const formData = new FormData();
       formData.append('image', tempImage);
       await fetch(`${process.env.REACT_APP_API_URL}/api/products/addImage/${addedProduct._id}`, {
         method: 'POST',
         body: formData,
       });
     }
      // Actualiza la lista de productos
     const updatedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/products/get`);
     const updatedProducts = await updatedResponse.json();
     setProducts(updatedProducts);
      toggleModal();
   } catch (error) {
     console.error('Error al agregar el producto:', error);
   }
 };
 


 const handleEditProduct = async () => {
   try {
     const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/update/${currentProductId}`, {
       method: 'PUT',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(newProduct),
     });


     if (!response.ok) {
       throw new Error('Error al editar el producto');
     }


     const updatedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/products/get`);
     if (!updatedResponse.ok) {
       throw new Error('Error al obtener los productos actualizados');
     }


     const updatedProducts = await updatedResponse.json();
     setProducts(updatedProducts);


     toggleModal();
   } catch (error) {
     console.error('Error al editar el producto:', error);
   }
 };


 const handleDeleteProduct = async () => {
   try {
     const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/delete/${productToDelete}`, {
       method: 'DELETE',
     });


     if (!response.ok) {
       throw new Error('Error al eliminar el producto');
     }


     const updatedResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/products/get`);
     if (!updatedResponse.ok) {
       throw new Error('Error al obtener los productos actualizados');
     }


     const updatedProducts = await updatedResponse.json();
     setProducts(updatedProducts);
     toggleDeleteModal();
   } catch (error) {
     console.error('Error al eliminar el producto:', error);
   }
 };


 const renderProducts = () => {
   return products.map((product) => (
     <div key={product._id} className={styles.productItem}>
       <div className={styles.productImageContainer}>
         {product.srcImage && product.srcImage.length > 0 ? (
           product.srcImage.map((image, index) => (
             <img
               key={index}
               src={image}
               alt={`${product.brand} - ${product.modelo}`}
               className={styles.productImage}
             />
           ))
         ) : (
           <img
             src="/assets/images/default.png"
             alt="Imagen por defecto"
             className={styles.productImage}
           />
         )}
       </div>
       <div className={styles.productInfo}>
         <h3>{product.brand} - {product.modelo}</h3>
         <p>{product.description}</p>
         <p>Precio: ${product.price}</p>
         <p>Capacidad: {product.capacity} puffs</p>
         <p>Sabores: {Array.isArray(product.flavors) && product.flavors.length > 0
           ? product.flavors.join(', ')
           : 'Sin sabores'}</p>
       </div>
       <div className={styles.actions}>
 <button
   className={styles.editBtn}
   onClick={() => {
     console.log('Producto seleccionado para editar:', product); // Debug
     toggleModal(product);
   }}
 >
   <MdEdit size={20} />
 </button>
 <button
   className={styles.deleteBtn}
   onClick={() => toggleDeleteModal(product._id)}
 >
   <MdDelete size={20} />
 </button>
</div>
     </div>
   ));
 };


 return (
   <div className={styles.container}>
     <h1>Lista de productos</h1>
     <button className={styles.addBtn} onClick={() => toggleModal()}>
       <MdAddCircle size={40} />
     </button>
     <div className={styles.productList}>
       {renderProducts()}
     </div>


     {isModalOpen && (
       <div className={styles.modal}>
         <div className={styles.modalContent}>
           <h2>{editMode ? 'Editar Producto' : 'Agregar Producto'}</h2>
           <input
             type="text"
             name="brand"
             placeholder="Marca"
             value={newProduct.brand}
             onChange={handleInputChange}
           />
           <input
             type="text"
             name="modelo"
             placeholder="Modelo"
             value={newProduct.modelo}
             onChange={handleInputChange}
           />
           <textarea
             name="description"
             placeholder="Descripción"
             value={newProduct.description}
             onChange={handleInputChange}
           ></textarea>
           <input
             type="number"
             name="price"
             placeholder="Precio"
             value={newProduct.price}
             onChange={handleInputChange}
           />
           <input
             type="number"
             name="capacity"
             placeholder="Capacidad"
             value={newProduct.capacity}
             onChange={handleInputChange}
           />


           <div className={styles.imageContainer}>
             <h3>Imágenes</h3>
             <ul>
               {newProduct.srcImage.map((image, index) => (
                 <li key={index}>
                   <img src={image} alt={`Imagen ${index + 1}`} className={styles.productImage} />
                   <button
                     onClick={() =>
                       setNewProduct((prev) => ({
                         ...prev,
                         srcImage: prev.srcImage.filter((_, i) => i !== index),
                       }))
                     }
                     className={styles.deleteFlavorBtn}
                   >
                     Eliminar
                   </button>
                 </li>
               ))}
             </ul>
             <input
               type="file"
               name="image"
               onChange={handleFileChange}
               accept="image/*"
             />
           </div>


           <div className={styles.flavorsContainer}>
             <h3>Sabores</h3>
             <ul>
               {newProduct.flavors.map((flavor, index) => (
                 <li key={index} className={styles.flavorItem}>
                   {flavor}
                   <button
                     type="button"
                     className={styles.deleteFlavorBtn}
                     onClick={() =>
                       setNewProduct((prev) => ({
                         ...prev,
                         flavors: prev.flavors.filter((_, i) => i !== index),
                       }))
                     }
                   >
                     X
                   </button>
                 </li>
               ))}
             </ul>
             <input
               type="text"
               name="flavor"
               placeholder="Añadir sabor"
               value={newProduct.newFlavor || ''}
               onChange={(e) =>
                 setNewProduct((prev) => ({
                   ...prev,
                   newFlavor: e.target.value,
                 }))
               }
             />
             <button
               type="button"
               className={styles.addFlavorBtn}
               onClick={() => {
                 if (newProduct.newFlavor) {
                   setNewProduct((prev) => ({
                     ...prev,
                     flavors: [...prev.flavors, newProduct.newFlavor],
                     newFlavor: '',
                   }));
                 }
               }}
             >
               Añadir Sabor
             </button>
           </div>


           <div className={styles.modalActions}>
             <button
               className={styles.confirmBtn}
               onClick={editMode ? handleEditProduct : handleAddProduct}
             >
               {editMode ? 'Actualizar' : 'Confirmar'}
             </button>
             <button className={styles.cancelBtn} onClick={toggleModal}>
               Cancelar
             </button>
           </div>
         </div>
       </div>
     )}


     {deleteModalOpen && (
       <div className={styles.modal}>
         <div className={styles.modalContent}>
           <h2>Confirmar Eliminación</h2>
           <p>¿Estás seguro de que deseas eliminar este producto?</p>
           <div className={styles.modalActions}>
             <button className={styles.confirmBtn} onClick={handleDeleteProduct}>
               Confirmar
             </button>
             <button className={styles.cancelBtn} onClick={toggleDeleteModal}>
               Cancelar
             </button>
           </div>
         </div>
       </div>
     )}
   </div>
 );
};


export default AdminProductos;
