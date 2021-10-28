type PropTypes = {
    children: React.ReactChild
}

export default function PageTitle(props: PropTypes) {
    return <h1 className="text-white text-4xl font-bold mb-10">{props.children}</h1>
}
