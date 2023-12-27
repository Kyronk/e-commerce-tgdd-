import React from 'react'
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { Link } from "react-router-dom";
import icons from "../utils/icons";

const { MdArrowForwardIos } = icons;

// const userNamesById = { 1: "John" };

// const DynamicUserBreadcrumb = ({ match }) => (
//     <span>{userNamesById[match.params.userId]}</span>
// );


// const routes = [
//     // { path: "/users/:userId", breadcrumb: DynamicUserBreadcrumb },
//     { path: "/users/:userId", breadcrumb: DynamicUserBreadcrumb },
//     { path: "/example", breadcrumb: "Custom Example" },
// ];

const Breadcrumb = ({ title, category }) => {

    const routes = [
        { path: "/:category", breadcrumb: category },
        { path: "/", breadcrumb: "Home" },
        { path: "/:category/:pid/:title", breadcrumb: title }
    ];

    // console.log({title})
    const breadcrumbs = useBreadcrumbs(routes);
    // console.log(breadcrumb);
    return (
        <div className='text-sm flex items-center gap-1'>
            {breadcrumbs?.filter(el => !el.match.route === false).map(({ match, breadcrumb }, index, self) => (
                <Link className='flex gap-1 items-center hover:text-main' key={match.pathname} to={match.pathname}>
                    <span className='capitalize'>{breadcrumb}</span>
                    {index !== self.length - 1 && <MdArrowForwardIos />}
                </Link> 
            ))}
        </div>
    )
}

export default Breadcrumb