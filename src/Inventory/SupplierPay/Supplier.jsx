import React, { useEffect, useState } from 'react'
import axios from 'axios'
const Supplier = () => {

    const [data, setdata] = useState([])

    useEffect(() => {
        axios.get(`${urlink}/Inventory/post_indent_issue_details?Indent_Type=raise&Status=Waiting`)
            .then(res => {
                setdata(Array.isArray(res.data) ? res.data : [])
            })
            .catch(err => console.error(err))
    }, [])

    const columns=[
        {
            key:'id',
            name:'S.No'
        }
    ]
    return (
        <div>
            

        </div>
    )
}

export default Supplier