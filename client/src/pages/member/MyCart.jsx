import React from 'react'
import withBaseComponent from 'src/hocs/withBaseComponent'

const MyCart = (props) => {

    return (
        <div onClick={() => props.navigate("/")} >MyCart</div>
    )
}

export default withBaseComponent(MyCart)