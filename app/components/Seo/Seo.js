import React from 'react'
import { Helmet } from "react-helmet";
import brand from "dan-api/dummy/brand";

export default function Seo({name}) {
    const title = brand.name + " | " + name;
    const description = brand.desc;
    return (
    <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
    </Helmet>
    );
}
