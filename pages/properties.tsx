import React from 'react';
import { ViewProperty } from '../types/property';

import { Properties } from '../components';

const Index: React.FC = () => {
    return <Properties />;
};

export default Index;

// import React from 'react';
// import { ViewProperty } from '../types/property';

// import { Properties } from '../components';

// type Props = {
//     properties: ViewProperty[];
// };

// const Index: React.FC<Props> = ({ properties }) => {
//     return <Properties allProperties={properties} />;
// };

// export default Index;

// export async function getServerSideProps() {
//     const res = await fetch(`${process.env.HOST_ADDRESS}/api/properties`);
//     const { data } = await res.json();

//     return {
//         props: {
//             properties: data
//         }
//     };
// }
