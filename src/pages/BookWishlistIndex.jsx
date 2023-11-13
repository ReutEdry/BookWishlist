import { useEffect } from "react"
import { bookService } from "../services/book.service.local"
import { useState } from "react";
import { BookPreview } from "../cmps/BookPreview";
import { BooksWishlist } from "../cmps/BooksWishlist";
import { svgs } from "../cmps/Svgs";


export function BookWishlistIndex() {
    const [books, setBooks] = useState(null)
    const [currBook, setCurrBook] = useState(null)
    const [bookPlace, setBookPlace] = useState('first')

    useEffect(() => {
        onLoadBooks()
    }, [])

    async function onLoadBooks() {
        try {
            const books = await bookService.query()
            setBooks(books)
            setCurrBook(books[0])
        } catch (err) {
            console.log('Cannot load books', err);
        }
    }

    function onChangeCurrBook(direction) {
        if (!books || !books.length) return
        if (direction === 'next') {
            let currIndex = books.findIndex(book => book.id === currBook.id)
            let newIndex = currIndex + 1
            setCurrBook(books[newIndex])
            if (newIndex === books.length - 1) setBookPlace('last')
            else setBookPlace('')
        }
        if (direction === 'previous') {
            let currIndex = books.findIndex(book => book.id === currBook.id)
            let newIndex = currIndex - 1
            setCurrBook(books[newIndex])
            if (newIndex === 0) setBookPlace('first')
            else setBookPlace('')
        }
    }

    function getArrowClass(direction) {
        if (books.length <= 1) return 'inactive'
        if (direction === 'left') {
            if (bookPlace === 'first') {
                return 'inactive'
            } else return ''
        }
        if (direction === 'right') {
            if (bookPlace === 'last') {
                return 'inactive'
            } else return ''
        }
    }

    if (!books || !books.length) return <div>Loading...</div>
    return (
        <main>
            <section className="book-display">
                <button className={getArrowClass('left')} onClick={() => { onChangeCurrBook('previous') }}>{svgs.leftArrow}</button>
                <BookPreview book={currBook} />
                <button className={getArrowClass('right')} onClick={() => { onChangeCurrBook('next') }}>{svgs.rightArrow}</button>
            </section>
            <section className="books-wishlist">
                <BooksWishlist />
            </section>
        </main>
    )
} 