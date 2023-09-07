const Book = require('./bookClass');
const books = require('./books');

const createBookHandler = (request, h) => {
  try {
    const { payload } = request;
    if (!payload.name) {
      return h
        .response({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku',
        })
        .code(400);
    }
    if (payload.readPage > payload.pageCount) {
      return h
        .response({
          status: 'fail',
          message:
            'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        })
        .code(400);
    }
    const newBook = new Book(payload);
    books.push(newBook);
    return h
      .response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: newBook.id,
        },
      })
      .code(201);
  } catch (error) {
    return h
      .response({
        status: 'error',
        message: 'Gagal menambahkan buku. Terjadi kesalahan internal',
      })
      .code(500);
  }
};

// ===============================================================

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  if (name) {
    const query = name.toLowerCase();
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(query)
    );
  }

  if (reading) {
    const isReading = reading === '1';
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  if (finished) {
    const isFinished = finished === '1';
    filteredBooks = filteredBooks.filter(
      (book) => book.finished === isFinished
    );
  }

  const formattedBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return h
    .response({
      status: 'success',
      data: {
        books: formattedBooks,
      },
    })
    .code(200);
};

// ===============================================================

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.find((value) => value.id === bookId);

  if (!book) {
    return h
      .response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      })
      .code(404);
  }

  return h
    .response({
      status: 'success',
      data: {
        book,
      },
    })
    .code(200);
};

// ===============================================================

const updateBookByIdHandler = (request, h) => {
  const { payload } = request;
  const { bookId } = request.params;
  const searchedBook = books.find((book) => book.id === bookId);

  if (!payload.name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
  }
  if (payload.readPage > payload.pageCount) {
    return h
      .response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }
  if (!searchedBook) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      })
      .code(404);
  }
  searchedBook.updateBook(payload);
  return h
    .response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    })
    .code(200);
};

// ===============================================================

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index === -1) {
    return h
      .response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      })
      .code(404);
  }

  books.splice(index, 1);

  return h
    .response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    })
    .code(200);
};

module.exports = {
  createBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
