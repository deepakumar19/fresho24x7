import React from 'react'

const SearchBar = () => {
  return (
    <div className="row justify-content-center">
    <div className="col-md-8 ">
      <form class="d-flex">
        <div class="input-group mb-3 mt-3">
          <input type="text" class="form-control" placeholder="Search for tea, coffee...." aria-label="Recipient's username" aria-describedby="button-addon2" />
          <button class="btn btn-success text-light" type="button" id="button-addon2">Search</button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default SearchBar