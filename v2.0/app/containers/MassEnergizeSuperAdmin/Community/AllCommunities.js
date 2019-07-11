import React from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import {
  TableWidget,
} from 'dan-components';
import avatarApi from 'dan-api/images/avatars';
import imgApi from 'dan-api/images/photos';

class AllCommunities extends React.Component {
  render() {
    const title = brand.name + ' - All Communities';
    const description = brand.desc;
    //  createData('QWE123', 'Woman Bag', '23 Oct 2018', 300, avatarApi[6], 'John Doe', imgApi[21], 'blur_on', 14, 30, 'Error', 'Canceled'),

    const tableData = {
      title: 'All Communities',
      data: [
        {
          id: '1',
          name: 'Wayland Community',
          date: '23 Oct 2018',
          total: 450,
          avatar: avatarApi[6],
          buyerName: 'Ellen Tohn',
          photo: imgApi[21],
          type: 'blur_on',
          currentStock: 14,
          totalStock: 30,
          geography: 'Geographically Specific',
          status: 'Success',
          statusMessage: 'Verified',
        },
        {
          id: '6',
          name: 'Bethel Temple',
          date: '23 Oct 2018',
          total: 1050,
          avatar: avatarApi[6],
          buyerName: 'Steve Breit',
          photo: imgApi[21],
          type: 'blur_on',
          currentStock: 14,
          totalStock: 30,
          geography: 'Geographically Dispersed',
          status: 'Error',
          statusMessage: 'Unverified',
        },
        {
          id: '7',
          name: 'Concord',
          date: '23 Oct 2018',
          total: 100,
          avatar: avatarApi[6],
          buyerName: 'Brad Hubbard',
          photo: imgApi[21],
          type: 'blur_on',
          currentStock: 14,
          totalStock: 30,
          geography: 'Geographically Specific',
          status: 'Success',
          statusMessage: 'Verified',
        },
        {
          id: '8',
          name: 'Sudbury',
          date: '23 Oct 2018',
          total: 35,
          avatar: avatarApi[6],
          buyerName: 'Kaat Tohn',
          photo: imgApi[21],
          type: 'blur_on',
          currentStock: 14,
          totalStock: 30,
          geography: 'Geographically Specific',
          status: 'Error',
          statusMessage: 'Unverified',
        },
        {
          id: '9',
          name: 'Boston Community',
          date: '23 Oct 2018',
          total: 50,
          avatar: avatarApi[6],
          buyerName: 'Jeremy Harper',
          photo: imgApi[21],
          type: 'blur_on',
          currentStock: 14,
          totalStock: 30,
          geography: 'Geographically Dispersed',
          status: 'Success',
          statusMessage: 'Verified',
        },
        {
          id: '10',
          name: 'Ablekuma Community',
          date: '23 Oct 2018',
          total: 0,
          avatar: avatarApi[6],
          buyerName: 'John  Harper',
          photo: imgApi[21],
          type: 'blur_on',
          currentStock: 14,
          totalStock: 30,
          geography: 'Geographically Dispersed',
          status: 'Error',
          statusMessage: 'Unverified',
        }
      ]
    };


    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        {/* <PapperBlock title="All Communities" desc="Some text description"> */}
        <TableWidget tableData={tableData} />
        {/* </PapperBlock> */}
      </div>
    );
  }
}

export default AllCommunities;
