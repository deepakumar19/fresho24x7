import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import styles from "./CategoryDetail.module.css";
import Pagination from '../utils/Pagination';
import Spinner from 'react-spinner-material';
import "../../src/styles.css";

const CategoryDetail = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [, setFilteredCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const [qty] = useState(1); // Quantity state
    const navigate = useNavigate();
    const categoryId = useParams().id
    const isItemDetailPage = useLocation().pathname.includes("product");
    const user = useSelector(state => state.authentication.user); // Get user from Redux
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 4;

    const fetchProducts = useCallback(() => {
        try {
            const unsub = onSnapshot(collection(db, 'products'), (snapshot) => {
                const fetchedProducts = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log(fetchProducts)
                setProducts(fetchedProducts);
            });
            return unsub;
        } catch (err) {
            toast.error('Something went wrong while fetching products!');
            console.error('Firestore error:', err);
        }
    }, []);

    // Set up products fetching on component mount
    useEffect(() => {

        const unsub = fetchProducts(); // Start fetching products
        return () => unsub(); // Cleanup the listener when component unmounts

    }, [fetchProducts, currentPage]);

    const fetchCategories = useCallback(() => {
        try {
            setLoading(true);
            const categoriesRef = collection(db, 'categories');
            const q = query(categoriesRef, orderBy('createdAt', 'asc'));
            const unsub = onSnapshot(q, (snapshot) => {
                const fetchedCategories = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setCategories(fetchedCategories);
                setFilteredCategories(fetchedCategories);
                setLoading(false);
            });
            return unsub;
        } catch (err) {
            toast.error('Something went wrong!');
            console.error('Firestore error:', err);
            setLoading(false);
        }
    }, [setCategories, setFilteredCategories]);

    useEffect(() => {
        const unsub = fetchCategories();
        return () => unsub();  // Clean up the listener
    }, [fetchCategories]);



    const selectedCategory = categories.filter(category => category.id === categoryId);
    // Fetch products of a particular category
    const itemsWithCategory = products?.filter((p) => {
        return p.category === categoryId;

    });
    const sliced = itemsWithCategory.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const noOfPages = Math.ceil(itemsWithCategory?.length / pageSize);
    const pages = Array.from({ length: noOfPages }, (_, i) => i + 1);

    const addToCartHandler = (product) => {
        if (!user) {
            navigate("/sign-in")
        }
        else
            dispatch(addToCart({ product, qty, user }))

    };

    return (
        <>
            
            {!isItemDetailPage && (<>
                <div className='row mb-5'>
                    {!loading && sliced?.length === 0 && <div className='row'><img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEBUQEBMQFhAQEhcVFREQFRIQEBAYFRUXFxUSFhYYHSggGBolHRcYITEhJSkrLi8vFx8zODMsNzQtLisBCgoKDg0OGxAQGysmICYvNy8wLS0tKy0vMC0vNy0vLTAtLS0vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALwBDAMBEQACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABAYBAwUCB//EAEgQAAIBAgMEBQgHBgUCBwEAAAECAAMRBBIhBQYxURMUQWFxIlJigZGhstEHIzIzNHKSFUJzgrGzJFNjweF0wjVUg4TD8PEl/8QAGgEBAAIDAQAAAAAAAAAAAAAAAAQFAgMGAf/EADsRAAICAgECAwQIBQIGAwAAAAABAgMEEQUSIRMxcQZBUYEUIjIzYZGhwSM0sdHhQmIVJVJy8PEkNUP/2gAMAwEAAhEDEQA/APuMAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAj4PG0qy56NSm68M1NlcA8tO2ASIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgHPxW3cHSbJVxOGRxxWpVpow9RN4BnG7Hw9Zs7016S1hVS9Kuo5CqhDj1GAaP2fiaf3GJLD/AC8UgrADkroVceLF4B5/atel+Iw1QAcamFPW6Y/lAFUnuCHxgG7BbdwtZujpVqbVBoaYYCqhtezofKQ9xAM8bS8xpnQvPQYL9xgGDU7m9kA8mv6L/pMA8nFjk/6TAMddXk36TAHXU7/YYA66nM+w/KAOu0+fuPygGeu0+fuPygDrtPn7j8oA65T5+4/KADjafne4/KAOuJz9x+UAdcp8/cflAHXafP3H5QB12nz9zfKAOupzPsPygGOup3+wwB11PS9hgGetryb9JgGRiR5r/pMA9it3N7DAMh+4wD1eAeatUKMzEADtPfoJ42l3YS2cobzYV9KDnEMDa2EU4gA2vlZ08imfzsOM9BnpsdV+xTo0FPBq56xVHcaVMhR49IfCAZ/Ygf8AEVa9b0WboqP5TTpZQy9z5oB0MLhadJQlJERBwSmoRR4AaCAboAgCAcfE0KYxQcqMzBQW1F7ByL246gcZ50pvZ7t60dQUl5Cenhnol5D2QB0S8hAHRryEAwaY5QDBUcoBiw5H3wBpyPtPzgDTk3tPzgDT0vafnAFl9L2n5wDPk9/tMA0YrDLUFjmHHhY8RYjygeztmM4KRlGWjfp3+0zIxGnf7TAGnf74A07/AHwDOnI++ANORgGdORgGQo5QBlEAZRygDKOUAZByEAjbRCikxPYLi1wbjUHTXjaeNJ9mE9DZdBKdILTUKovYDQcYS0tBvZLnoEAQBAEAQDkY5b1wPD+lSAbkrtT0OogEylXVuEA2wBAEAQBAEAxaALQBaALQBaALQBaALQDMAQBAEAQBAEAQDRVxIHDUwCHjQWpOT5pgEvAHyPW3xGASIAgCAIAgCAcjFn/ED+X4akAnNTDiAc+rTZDAODvFvyuD+qRRUr2vlJslMHgXI1v22Humi/IjX295ZYHG2ZT35R+JXqO8m2cT5dHOE/0qKZPAM4N/bIf0jIl3ii6fHcZT9W2ff1N1DfbaOFcLi0DjtWonQVbc1IFvdCzLIPViE+Dxr4dWNP8AXaPoWxNsUcZSFaiSVOhU6OjdqsOwywhNTj1I5nIx7KJuFi0z57i979pHFPQotSP1700U01ubOQouTx4SBLKt8RwikdJVw+K8aN9ja7bZtbfXaWFcDFUaTK2tspplh2lXBKn2T15dlb1ZEwjw2LkQcsazeiwbe3nb9nLjMIwBd1H1ihivEMrC/EESRbfqrxIFbicf1Zn0e7t5lZwG8+2a4LUQjhTYlaINjy4yLDJvmtxWy3v4nj6H02WNP1LLulj9pVKzLjVy0+jJX6vo7tmXtvyvpJVE7ZN9a0VHI0YdUYvHn1P3lb2zvrj6OKq00alkp1nVVamCcqsQATfkOMjW5k4TcfgW2HwdF+PGxt7aL/u9tqnjaIq09DwdDq1Nu1T/ALHtEnV2KyPUjnMrGnjWOuZz9+trVsJhhVoFQ5qqt2UOLFXJ09QmGRa64dSJPF4sMrIVc/LTNW4e2a+Lw9SpXZSy1ioKrkFgiG1vFjPMa2VkNsy5XDhi3quG9a33K9ulvdjcRjKVGq9M03zXC0wpNkYjW/MCaKcqc7Ol+RY8hxFOPi+LFvfb9STvzvRi8JihSoMgQ0lazIHNyzg637hPcnJnXLSMOJ4qnLqc5t7T12+R2tyt6BjaeSpYYmmPLUaBx/mKOXMdh9U3Y96tj+JA5PjpYdmvOL8mdfbuJelhq1VCA9Ok7KSLgEKSNO2bbJdMW0QqIKdsYvybSKpuFvLisXXdK7IVWlmAVAmuZRxv3yLi5ErW1IueY4yrDhFw33fvOjvbvjTwX1SKKmIIvlvZKYPAuf8AYa+E235EavUicdxdmY9rtH4lSp7wbaxA6SlnCf6VFOj8AXBv7ZDWRkT7xRdS43jaPq2z7+p6o797QwrhMXTDjtV06CrbmpAsfZM45dkHqxGuzhsa6PVjT/cvGC2sMVSWrTzBKguAwKsO4j/6JYRkpLaOZsrlXNwl5on4fD9pnpgNpH6px6JgHvZv3f8AM3xGASoAgCAIAgCAcXGH/Efp+GpAJ9NoB7xLDIzEXyqT7BeD1Lb0fEdg4I4vGr0vlF2ao/pkAuR4Ei3hKin+Lb9Y7fP/APh4f8P8F/k+kjZVL99FdgLXcAgdyjgo7hLfWjh223tkTbmy6b4Z0AAVUZlXsRlBIZfNvaxA0N/Car61ODTJuBkzx74zj8/xRXPov2iUxbU7+RWpm47Myaq3szD1yBgyam4nRe0NcZ0xs96evkzndbSltM1XNkp4xmYgFiAKpJ0GpmnqUcjb+JN8OVvFqEO7cUdHfPb2FxISlhEOVXLs2Q0wzEBbKp17NTYcBNuXdGxKMe5D4Tj7saUrLey1olY7APQ2KEqAh2xCuVPFMwsFPI2ANvSmc4OGLpmmjIhfy/XDy01v46Rzd2d4cPhab06+HasHcOLdGQtlI/ePHWasXJhVFqRL5fircu1Tra7LXcum6G3sLiqrJQw3QsqZixFMXGYC3knvk+nIja2kc3ncZbhxUrGu/wACi7Rw4q7Uek18tTGFDbjZquW49srbIqWQ4v4nWY1squMVkfNR2bsPWr7Ixl/tIftAaLXp3NiOTDW3IgjnM4ueNZp+RoshTy2N1R7SX6P4ehat/wDHU8Rs2nWpNmR6yEHt+xUuCOwg6ESVlyUqdop+ErlXn9E1ppM9/RX+Eq/9Q39qnPMH7r5j2h/ml6L9yobg/wDiFH+f+28i4v3/AOZd8z/9f+RN+lD8cP4CfFUmWf8AeL0NXs3/AC8v+79kQNpbOrYB6OKoMcrKjo/HIzIGak/MEH1g+NsZ1yx5KcfI2Y+TVyVcqLftL/zaL4dvU8dsuvUWwdaFQVKd9abZD7Qew/8AMn+KrKm18DmniTxcyFc/+pafxWyr/RdUAxNUnh0B+NJE4/zkXntL3rr9WV7ZlTrmPU1denqs7d9gXK9wsLTVCPi3fW+JLvs+h4Gq/NJfm/efR8bRw6IaldUKourOuZUHCyr+6o5CXD1FfgcQoyslpd2ziVdpbLYBVr0goNwpRnRT5yKVsp93MGapW1S82iZXiZkN9EZLfwLTu5jsJWumHq9IyAFvtk66AksJnCyMvssj3Y1tOvEi1v4ndYzM0EHaR+rf8pgGzZR+r/nf4jAJkAQBAEAQBAOJjPxH6fheATVMA9sbgi17jhz5iAfH2WpszGq9swptdb6CtTa6mx71JHcfCUunj3bZ3icOTwelPvr8mj6PhNvYDEpmSvSU21Sqy06i9xVj7xpLaN0JLaZxt2FfTLpnFlX3w3moJSejh3WpUqKVLUzmp01OjHMNCbcAJpvyIxjpPuT+O4y22xTnFqK+Jzfo82awc4hgQMpVPS1GZvAWt4numrCra3NkvnspPVK93dnGpIH2kUcAq2LYMp4EGoQRI/SpX6fxLHxZV8cpRemoo+i7P2KlI5h0akf5NNUb9bZmHqIlnGmEe6SOTtzL7Vqc216kf6QayjAZQLAVU/7ppzPumTuDesyPo/6HC3GqYU0agr1KNNukBBqCgWIy6gCqDpflymjCUOh9Wiw56d3jR8NvWvdsuuxDhVcmjXo1Gy6rTGGDAXGp6JQbXtx04SfFR/06Oetdr+8b+ez51WqD9sf+/wD/AJ5VP+Z+Z2MH/wAp1/sPoe9Ox6WKpEHQjUN202878p4MPXxGtldSrY6ZyuDnTxLVOPl718UfKsVUrUA+EfRekDMh1AZQQHXxB49otKeTnBOtncVQovnHLh561/79C+/RfXAwlX/qD/bpywwV/D+ZzHtC95S9F+5Utw6wG0KJ/P8A23kTFX8f8y55iX/L/wAiX9JtcHHA/wCgnxVJnnL+IvQ1ezstY8vX9kXQ0kr4OmjKCGoUwRwzDILa9jA6g9h7ryx6FOHSzlvGnVe7IPTTZ8y2hTr4Gq6KxyVqbJfXLVptcEEdjDl2Ee2slGVEmvczrqrauRrjN/ai18n/AGZ0/o3Y9Yq/wf8AvWbsH7TIXtC/qQ9WcvF0KmAxgdRcI+enfQOlyLX7NLqeRvNUt027ZLplHPw+heetP1R9DTaWCxuHZemojOtmpVnFF17SDfXs4i4lj4ldkdbOXljZGLan0vafbt2KZvDTwFJRTw2Vq2byqlOo1Wkij90MQMzE8tABK3JjTBah5nU8TbnXS67u0fTWy3fRls1qVJ6zixr5coPmLezesk/pkrBrcYOT95Ue0GVG29Vx/wBP9S6MZNKAibRP1T/lMA97IP1Z/iP8RgE6AIAgCAIAgHCxf4g+K/A8AmiAeg0A5e2NjJiFsVVtb5XuBfzlYao3tB7QZhOuM1qSJGPlW48+ut6ZU6+4gJ0XEjwFCsvqYuh9wkJ4Ed9my8h7SWpfXgn+hO2ZuIgYFkdrf+YZFQd/R0yS36hNleFCPd9zRkc/kWLpilH08y3U9koi2XjYC9gOHAADQAdgEmIo223tlLXcwpiusZK1xW6S+elkvmzcONpGWNFT69lnLlbHR4GlrWi0lCJJKs5W8ezes0eiIYjMG8gqraX87TtmuytTj0skYuTLHsVkV3RVjuSvmYj9dCRvoUPiy1/4/d/0x/U7O7G74wlVnVaozJl8tqZHEH93wm6nHVb2mQs3kZ5cUpJLXwIz7s3xXWMtbN0/S/bpZL581rcbe+Y/Ro9fXs2LlbFj+Bpa1ot+cyUVZXN4t3kxBU5WJXQGmyqwHmHNoV7Ry19Wi7Hjb5k/C5G3F2od0/cyTu1svqtJ0AfynL2dkJvlVbXXS3k++e1VKtaRrzMyWVZ4kkkzlbE3XGHrpVC1rpfV2pFdVK6ga9swrxowl1Ik5PK2X0+FJLX9jdvJu4MVW6QrVNkC+Q1MDQk/va31i3HjY9tmOFydmLBwgk/f3LFgqJSmiWPkIq62J8kAa28JIS0tFdKXU2yFtzYIxVMqVJub6EKwPnKTpe2hHaPATXbWrI6ZIxcqeNZ1wNO6m6PVqrPlqjMmU52psOIOmXXsmFVEam2mb83kbMuKU0lr4Hb2xu9SrplKqe3K9wL+crDVG79Qe0GbJ1xmtSRGx8m3Hl1VvTKdidwhfRcSPAUKw9TF0PuEhvAj7my9h7SWpfXgn+hN2VuQiMGZHNu3EFMo7+ipk5vW1u4zOvCri9vuR8nnsm6LjHUV+Hn+Zc6NIILDXmTxPs/p2SYUZ6vAI+0Pun/KYBs2P92f4j/FAJ0AQBAEAQBAOFi/xJ8V+B4BMgC8AZoBTt5N+zQqtQwyK7obNUqE5A3aqqNWI7dRIl2UoPpS2y7weHlfDxLH0xIJ332pRs1fD08h7GpVaN/BiT/QzS8uyPeUexMXDYlv1are/wAmXYbbZsA+LWmUdaL1BSq9hVSRe3FTa4OlwRJvX9Tq0UP0fV/g7331tHG3M3tr46u1KrTpKq0i90z3JDKLanh5RmjHyfFbWtFjyfFLDhGSlvb0WrHkLSd7AlEZhfhcAnWSm+xTxW2kUfdTeatjcT0NSnRVcjNdM+a4tbie+RKMp2z6dF1yXERxKlYpb76O7vFtKhgkDVWJZr5KS2NR7cbDsHedJIstjWtyK3Ew7cmfTWijVd9MbVa1CjSA82z1nt3kEf0kL6bKT+rEv1wFda3dZr9DOH32xVNsuIoIw7QoejUHgGuD7p6s5p/WRjP2fhKO6Z7/AF/oXjYuNpYyn0tA3F7Mp0emfNYdhk6FkZrcWc/kY9mPPosWmVTeDevE4bFVKCUqLBCoBbPmN1U62PfIl2U659Oi4wuFWRQrXLW/2NNTe/HUrdPhFUHzulpE+BYGYvNlH7UTZDg6rfu7U38jtU95BWwdSvhkJr0Sgag4LEZ2Av5PEWvYjlN6yFKtyj+RAlxk6siNNz0n7/ccOrvpjads+HorfhmFVb+0yK86S84lrD2fqn9m3foTNn74Y13QdVp5HdQXC1iACQCQb2mcMucml0mm/haKoSfiraXl2J29O+mIweJehTp0GVQpBfPm8pQdbHvmV+U659OjVx/DxyqPFctefb0LJvBj8RRw/S4dabOozFHDWZQLtlseI4+AMk2Saj1JFTi1V2WqFj0n7zi7n76Ni6rUa600fLmp5M1nt9pde22vgDNGPlK16a0WPJ8S8SKnF7TJe+e9PUaadGFatUPkq18oUfaY215AeM2X3qqOyPxvHvLscd6S95r3T23icWhqV0pIh0QU892t9piSdBfQcyDyntFkrI9TWjHkMWvGs8OMtv3/ANiwXm4gC8A0bQ+6f8pgGzY33Z/iP8UAnwBAEAQBAEA4eK/EnxX4HgEuAYMA8MZ6D5Ht/CVcJizXUXU1zVpuRdCc+fI3eDoRKi6Eq7Or5naYN9eVieDvT1pr9yy7H3hwNfyGHV6z2zB7NSqG9/tNdWN+GYAydXkQs7HPZPGZGM+pd18UWTbbBMFiFHbQq3J1LEo1yT2mbbfsP0ImL9/D1X9T57uTt+lgq7VK2fK1IqMilzcsp4eoyrxLI1ybkdfzWNbk1xjWt6ZccZ9IuBek6Dp7ujKL0yBcqQJNeVVrWznocPlKSbj+qKz9GtUdeF/8p/8AaQsFfxH6F97QveKvVfuRNsYhsdtJlLfbr9CnJED5Ft8XiTMbW7bun8dG7CUMLA8Reetv1Pp2A2LQpoEBYIOCIzUx4sVsXY9pPqtLeEIwWkcXffZfNzse2zXtXd+jWpmmWJU6DOxqGmTwdGY3Wx7L2IvpMbKo2LTM8XKsxrFOD/yfPNxsa2H2giX8moTSqC+h45T4hra8rysxJOFvT8TruZqhfh+MvNaa9Ga993H7RrG4tmT+2kxyX/H/ACM+I78cl6/ud/erefZz0KiYctUq1uNhUWmDmDZznsLi2ltdeUmZGRW4OK7lJxnG5MciNkl0pHj6NcBfpalS4p1FCLqVL2a5YEa2FgL+l4zXgQkk5Mke0eRCcoVxe2ttmn6T1RHw6oTYJU4szHVl7SbzzkF9kz9mml4ny/cs26dKk+Cw7NmzBLaO6jR2PAGxkzH+7j6FHyXfLs9WUP6Q6wOPqW82n/bWV+Yv4p1HBy1hfNn1TrGZAO4WPIjgZbI4p+Z8q3owL4LEriKHkqXzLbhTcalPy9o7jbnKu6t02dcfI67j8mOdjOi3zS/T3M1h6m1caXa6pYXA16Kmv7o5sSfa0875Nv4Gf1eLxP8Ac/1f+D6ngaApoFUAAAAAcFAFgo7hLVJJaRx8pOUnJ+bJIMGJ7EA0Y/7p/wApgG3Y33Z/iP8AFAJ8AQBAEAQBAOHivxPrX4HgEyAYMA8MJ6Dh4upha1ZsOKiDEBQWTRgw81lbyXI5cRfsmDlFvpNyrthFWpNL4lK3z3ep4dBVAVSz5cik5KlwSWVTqtrai5Go8JAyaIwXVE6PiOQtvl4Vnft5/wBydu7i6j7KxKuSRSSqqE6kL0V8t+6/sIm2iblS9kPkKIVZ0Ojttp/qcXcrAJXrOjqhtSJXpAWUHOgvYEdhPb2yPiQjKT6kWnNZFlNcXW9dy2V92aSo7MmGIVGPk03VrhTaxLntt2Sa8evXkjnoclldSXWyr/R+f8b/AOk/+0hYf3nyL/nv5Zeq/cjbdovhMaaijTpempk8GGfNl9Rup8JjanXd1fM2YU45eF4e++tP9j6RsnbVDFIHpOL9qEgVEPJl/wB+Es4WRmto5O/Hspl0zRp27vDRwiEsymrbyKQN3Y9lx2LzM8stjCO2Z4uJZkTUYr5lD3Kwj1cWtU3y0jnZubG+UeN9fAGV+LBzs6jpeXujTi+CvN6S9Ead72//AKFX8yfAk8yPvjPjG1gdvxPe8mAbBYrPSt0ZbNTzDMosfKpsDxt/QiLq/BsUl5DByVm4zrk/reT/AGZ9C3extKvRFanfy9GBJZkYcadz2Ds7iJZVzU4po5TJonTY4T8yp/ScfrKH5H/qshZ3+kvvZ7/9Pl+5aN0D/gaP5D8TSXR93H0KfkP5qz1KFv7+OqflT4Flfl/enScN/J/Nn1KiwyjUcB290tUce09nA39QdSc21zJ8X/J9sj5f3TLLh3rLj8/6HN+jCmClY21Dp/R/nNOD9l+pN9oW/FgvwL6ok8582LPAexANGP8Aun/KYBu2P92fzv8AFAJ0AQBAEAQBAOJi/wAT7PheATAIBnLAMFOXGAfO9s7kAuXTpEuxbRTWp3JvdSpzr4EHxMh2Ym5dUXovsbmuitV2wTSIdHcuo7DPVrP2eTSrFrcg1bKB7Zr+hzk/rSN//G6K0/Bq0/kXOnu6KeCfDoCuem62H1jAupBY8MzewaACTFUow6EUk8udl6un3e9/kcvc/dU4auzk1SGplfLpimBdlN75jy5ds00Y/hNvZM5DlFlwUenWn8S143Z+ak66+UjDTU6gjh2yS1tFVF6aZUd1d0Dh8SKhNUjKy2ekEGvbfOf6SLRjeHLq2W+fyqyqlX06778yw7c3Zp4hCCqt25ScuvnKwByt6iD2gyRZXGa1Ir8fJsx59db0UXGbgZW0aovLpKLOR4NSzX9gkJ4Uk/qyL6HPVyWra9+n+TZs/wCj8FvKNVgeIp0zRB8Xq2I9Smexwm3ucjGzn4qOqa9ev9kX7ZG79OggUKotwVb5VvxNzqzc2PuGkmwhGC1EoLr53T65vbKlt/cw18VUqg1RnK2ApBlFlC/azi/DlI1mL12dey1xeXVOP4PRvz77+JZN5d3kxNArY3OoKgM6MODAXF+0EX4HuE321qyPSV+HlyxrVZH5r4o4m6e7VTCVjZqpp1BZ0ekFW4+ywOc2I8NQfCaqKJVe/aJfIchDLSfRpr37N++e6/WnpkGoAisPIpipfMQfOFuE9vo8XXfWjHjuRWH1fV3v8Ts7v7H6HDU6RzXQEXYZCdSfs3NuPOba49MVEhZN3jWys1rb2Vfebc9sRiXqg1QGCiy0g48lQOOcX4cpHuxfEl1bLTB5dY1Xh9G/mcqn9H5DA3raEcaAt/cmKxJJ76jdPmapRa8Jdy6707JOIwxpDOMxU3VQ7CxBta4/rJNtfiQcSpw8n6Pcrdb17iHuXsE4Vaikuc5U+Wgp2sD6RvxmFFPhJrZv5HP+lzUunWkWXo5vK4ZYBm0Aj4/7p/ymAb9kj6v+dv6mATYAgCAIAgCAcXG/iB6vheATRAMwD0IB6BEA9hhAMhxAM9IOYgGOmXmIA6deYgGOsLzEAx1lOYgGOtJzgDrac4AOLTnAHWk5wD11hOYgGenXmIAFZeYgGelXmIBnMOYgGcw7oBgkQDybQDwRAPJEAi7Q+6f8pgEjZg+r/mb+sAlwBAEAQBAION2xh6LZKlRekIuKS3qVmHo0ku7eoQDgVNqNVxBth8UiLa1SrTsKhNrBFDFlsGYkuF+zbwwk2mtGSSOkS3nt+kzMxMHP5zfpMA85X85/ZAHRVOb+wQDHQVOb+75wDHVqvpe75wB1Sr6Xu+cAdTq+l7vnAHU6vpe75wB1Or6XsHzgGOqVfT/T/wAwDHVKvp/p/wCYBoxVCuouq1W46Kq3vbyeLDS/E/8A6MJ9XuMo695v6pV5P7B85mYjqtXk/wCn/mAZ6pV9P2D5wDPU6vpewfOAOpVeZ93zgDqdXmfd84A6rV9L2D5wDHQVOb+wfOAOjqc6n6R84B6Aqc6n6R84B6Bfzqn6RAPQZ/Of9I+cA8YpmyEEuQdPsE277Lcn1c5jNtLaPYpPzNWyt4FWmOsUcThzc3NVM9IHiT0tMsqr3sVmR4d7C4qnVUPSdHQ8HpsHU+BGhgG2AIByetYyp93RSiPPxLB3Hf0VIkEeNRT3QB+x2fXEV61T0Ebq1EdwWnZiO52aATsFgKNBclGnTpre+WmqoCeZAGpgEiAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAc7FbDw1RjU6PLVPGrRLUKxtwBemQxHcSRANXU8XT+6rrUXzMUgzdyrVpZco72VzAH7TxC6Pgq5btNCphnp+o1KiMfWogHWgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAf/Z" alt='coming soon' className={styles.image} /></div>}
                    <h2 className='lead fw-bold text-secondary mt-3 mb-3'>{selectedCategory?.[0]?.name}</h2>
                    {!loading && (sliced?.map(item => (<div className='col-md-3 mx-auto mt-2'>

                        <figure className="figure">
                            <img src={item?.image} className="figure-img img-thumbnail rounded" alt={item?.name} />
                            <figcaption className="figure-caption fw-semibold">{`${item?.name} Rs.${item.price}`}</figcaption>
                            <button className='btn btn-success mt-2' onClick={() => addToCartHandler(item)}>Add To Cart</button>
                        </figure>

                    </div>)))
                       }



                </div>
                {loading && <div className={'spinnerContainer'}>
                            <Spinner radius={120} color={"#003972"} stroke={2} visible={true} />
                        </div>}
                {sliced.length > 0 && (
                    <div className='d-flex justify-content-center'>
                        <Pagination pages={pages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    </div>
                )}

            </>)}
            <Outlet />
            <ToastContainer />
        </>

    )
}

export default CategoryDetail