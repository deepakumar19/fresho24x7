import React from 'react'

const Pagination = ({pages, currentPage, setCurrentPage}) => {

    const handlePrev = ()=>{
        if(currentPage > 1){
          setCurrentPage(prev=>prev-1);
        }
      }
      const handleNext = ()=>{
        if(currentPage !== pages.length){
          setCurrentPage(prev=>prev+1);
        }
      }
    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination">
                <li className="page-item" onClick={handlePrev}><a className="page-link" href="#">Previous</a></li>
                {
                    pages?.map(page=>(
                        <li class="page-item" onClick={()=>setCurrentPage(page)} key={page}><a className="page-link" href="#">{page}</a></li>
                    ))
                }
               
               
                <li className="page-item" onClick={handleNext}><a className="page-link" href="#">Next</a></li>
            </ul>
        </nav>
    )
}

export default Pagination