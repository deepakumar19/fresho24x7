import { useState } from "react"

export const useForm=(initialState)=>{
    const [formData, setFormData]=useState(initialState)

    const handleChange = (e)=>{
        const {id, value}= e.target
        setFormData({...formData, [id] : value})
    }
    return [formData, handleChange]
}