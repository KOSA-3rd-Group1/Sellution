import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const useDetail = () => {
    const { id } = useParams();
    const [ activeSlide, setActiveSlide ] = useState(1);
    const [productToShow, setProductToShow] = useState(null);
    const [isLoading, setIsLoading ] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=> {
        const fetchProduct = async () =>{
            try{
                const response = await axios.get(`/products/${id}`);
                setProductToShow(Response.data);
            }catch(err){
                setError(err);
            }finally{
                setIsLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    return(
        activeSlide,
        setActiveSlide,
        productToShow,
        isLoading,
        error,
    );
}
export default useDetail;