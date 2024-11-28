import React from 'react'
import { useParams } from 'react-router-dom'

const ProductDetail = () => {

  const id = useParams().productId
  return (
    <div className='col-md-6 mx-auto mt-5'>

      <figure className="figure">
        <a href="/category/1"><img src="https://tse1.mm.bing.net/th?id=OIP.KghvU4nz3oHe8LNfKEi0PwHaFS&pid=Api&P=0&h=220" className="figure-img img-fluid rounded" alt="..." /></a>
        <figcaption className="figure-caption fw-semibold">Fresh Watermelon 500 gms</figcaption>
        <div className='mt-2 mb-2 col-md-3'>
          <select class="form-select" aria-label="Default select example">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        <button className='btn btn-success mt-2 mx-auto justify-content-center'>Add To Cart</button>
      </figure>
    </div>
  )
}

export default ProductDetail