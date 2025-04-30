"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, User } from "lucide-react";

// Este es un componente de comentarios simple con estado local
// En una aplicación real, se conectaría a una base de datos

const Comments = ({ newsId }) => {
    const [comments, setComments] = useState([
        {
            id: 1,
            author: "María García",
            date: "25 de Octubre, 2023",
            content: "Excelente artículo, la información sobre los últimos avances es muy valiosa para mi práctica diaria.",
            avatar: "/assets/avatars/avatar-1.jpg",
        },
        {
            id: 2,
            author: "Carlos Rodríguez",
            date: "24 de Octubre, 2023",
            content: "Me gustaría saber si habrá más eventos como este en otras ciudades del país. ¿Alguien tiene información?",
            avatar: "/assets/avatars/avatar-2.jpg",
        },
    ]);

    const [newComment, setNewComment] = useState("");
    const [name, setName] = useState("");
    const [showForm, setShowForm] = useState(false);

    const handleSubmitComment = (e) => {
        e.preventDefault();

        if (!newComment.trim() || !name.trim()) return;

        // Crear nuevo comentario
        const comment = {
            id: Date.now(),
            author: name,
            date: new Date().toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
            }),
            content: newComment,
            avatar: "/assets/avatars/default-avatar.jpg", // Avatar por defecto
        };

        // Añadir al inicio de la lista
        setComments([comment, ...comments]);

        // Limpiar formulario
        setNewComment("");
        setShowForm(false);
    };

    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Comentarios ({comments.length})
                </h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center px-4 py-2 bg-[#C40180] text-white rounded-full hover:bg-[#A00160] transition-colors"
                >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <span>Añadir comentario</span>
                </motion.button>
            </div>

            {/* Formulario para añadir comentario */}
            {showForm && (
                <motion.form
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmitComment}
                    className="mb-8 bg-white rounded-xl shadow-md p-6"
                >
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tu nombre"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180]"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                            Comentario
                        </label>
                        <textarea
                            id="comment"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Escribe tu comentario..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C40180]/50 focus:border-[#C40180] min-h-[100px]"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="flex items-center px-4 py-2 bg-[#C40180] text-white rounded-full hover:bg-[#A00160] transition-colors"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            <span>Publicar comentario</span>
                        </motion.button>
                    </div>
                </motion.form>
            )}

            {/* Lista de comentarios */}
            <div className="space-y-6">
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    {comment.avatar ? (
                                        <img
                                            src={comment.avatar}
                                            alt={comment.author}
                                            className="w-10 h-10 rounded-full object-cover"
                                            onError={(e) => {
                                                e.target.src = "/assets/avatars/default-avatar.jpg";
                                            }}
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <User className="w-6 h-6 text-gray-500" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-md font-semibold text-gray-800">
                                            {comment.author}
                                        </h3>
                                        <span className="text-xs text-gray-500">{comment.date}</span>
                                    </div>
                                    <p className="text-gray-600">{comment.content}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-8 bg-white rounded-xl shadow-sm">
                        <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500">
                            No hay comentarios aún. ¡Sé el primero en comentar!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comments;