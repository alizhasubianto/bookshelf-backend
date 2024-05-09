const { nanoid } = require("nanoid");
const books = require("./books");

const addBooksHandler = (request, h) => {
    try {
        const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

        if (!name) {
            return h.response({
                status: "fail",
                message: "Gagal menambahkan buku. Mohon isi nama buku"
            }).code(400);
        }

        if (readPage > pageCount) {
            return h.response({
                status: "fail",
                message: "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
            }).code(400);
        }

        const finished = pageCount === readPage;

        const currentDate = new Date().toISOString();

        const book = {
            id: nanoid(16), 
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            insertedAt: currentDate,
            updatedAt: currentDate 
        };

        books.push(book);

        return h.response({
            status: "success",
            message: "Buku berhasil ditambahkan",
            data: {
                bookId: book.id // Mengembalikan id buku yang baru saja ditambahkan
            }
        }).code(201);
    } catch (error) {
        console.error("Error saat menyimpan buku:", error);
        return h.response({
            status: "error",
            message: "Internal server error"
        }).code(500);
    }
};

const getAllBooksHandler = (request, h) => {
    try {
        const allBooks = books;
        if (allBooks.length === 0) {
            return h.response({
                status: "success",
                data: {
                    books: []
                }
            }).code(200);
        }

        return h.response({
            status: "success",
            data: {
                books: allBooks.map(book => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }))
            }
        }).code(200);
    } catch (error) {
        console.error("Error saat mendapatkan buku:", error);
        return h.response({
            status: "error",
            message: "Internal server error"
        }).code(500);
    }
};

const getBookByIdHandler = (request, h) => {
    try {
        const bookId = request.params.bookId; 

        const book = books.filter((n) => n.id === bookId)[0];

        if (!book) {
            return h.response({
                status: "fail",
                message: "Buku tidak ditemukan"
            }).code(404);
        }

        return h.response({
            status: "success",
            data: {
                book: {
                    id: book.id,
                    name: book.name,
                    year: book.year,
                    author: book.author,
                    summary: book.summary,
                    publisher: book.publisher,
                    pageCount: book.pageCount,
                    readPage: book.readPage,
                    finished: book.finished,
                    reading: book.reading,
                    insertedAt: book.insertedAt,
                    updatedAt: book.updatedAt
                }
            }
        }).code(200);
    } catch (error) {
        console.error("Error saat mendapatkan id buku:", error);
        return h.response({
            status: "error",
            message: "Internal server error"
        }).code(500);
    }
};

const updateBookByIdHandler = (request, h) => {
    try {
        const bookId = request.params.bookId;
        const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
        const bookIndex = books.findIndex(book => book.id === bookId);

        if (bookIndex === -1) {
            return h.response({
                status: "fail",
                message: "Gagal memperbarui buku. Id tidak ditemukan"
            }).code(404);
        }

        if (!name) {
            return h.response({
                status: "fail",
                message: "Gagal memperbarui buku. Mohon isi nama buku"
            }).code(400);
        }

        if (readPage > pageCount) {
            return h.response({
                status: "fail",
                message: "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
            }).code(400);
        }

        books[bookIndex] = {
            ...books[bookIndex],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt: new Date().toISOString()
        };

        return h.response({
            status: "success",
            message: "Buku berhasil diperbarui"
        }).code(200);
    } catch (error) {
        console.error("Error saat mengupdate buku:", error);
        return h.response({
            status: "error",
            message: "Internal server error"
        }).code(500);
    }
};

const deleteBookByIdHandler = (request, h) => {
    try {
        const bookId = request.params.bookId;

        const bookIndex = books.findIndex(book => book.id === bookId);

        if (bookIndex === -1) {
            return h.response({
                status: "fail",
                message: "Buku gagal dihapus. Id tidak ditemukan"
            }).code(404);
        }

        books.splice(bookIndex, 1);

        return h.response({
            status: "success",
            message: "Buku berhasil dihapus"
        }).code(200);
    } catch (error) {
        console.error("Error saat menghapus buku:", error);
        return h.response({
            status: "error",
            message: "Internal server error"
        }).code(500);
    }
};

module.exports = { addBooksHandler, getAllBooksHandler, getBookByIdHandler, updateBookByIdHandler, deleteBookByIdHandler};
