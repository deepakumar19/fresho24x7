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
                <li className="page-item" onClick={handlePrev}><button className="page-link" href="#">Previous</button></li>
                {
                    pages?.map(page=>(
                        <li class="page-item" onClick={()=>setCurrentPage(page)} key={page}><button className="page-link" href="#">{page}</button></li>
                    ))
                }
               
               
                <li className="page-item" onClick={handleNext}><button className="page-link" href="#">Next</button></li>
            </ul>
        </nav>
    )
}

export default Pagination