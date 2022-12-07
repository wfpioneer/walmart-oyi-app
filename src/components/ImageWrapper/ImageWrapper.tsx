import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import styles from './ImageWrapper.style';
import { postApiCall } from './ImageWrapperUtils';
import {
  Environment, getEnvironment
} from '../../utils/environment';

interface ImageWrapperProps {
  itemNumber: number,
  countryCode: string;
  imageStyle?: any,
}

const urls: Environment = getEnvironment();

// eslint-disable-next-line max-len
export const getMXImageUri = (itemNumber: number) => `https://assets.sams.com.mx/image/upload/f_auto,q_auto:eco,w_350,c_scale,dpr_auto/mx/images/product-images/img_medium/${itemNumber}m.jpg`;

export const getImgDataParams = (uuid: string) => ({
  params: {
    query: {
      id: uuid,
      filters: {
        typesCriterion: [
          'item'
        ]
      }
    }
  }
});

export const getCNImageUri = (
  itemNumber: number,
  setImageUri: React.Dispatch<React.SetStateAction<any>>
) => {
  const uuidDataParams = {
    params: {
      query: {
        filters: {
          typesCriterion: [
            'item'
          ],
          attributesCriterion: [{
            itemnumber: {
              exact: itemNumber.toString()
            }
          }]
        }
      }
    }
  };

  try {
    postApiCall(urls.itemImageUUIDUrlCN, JSON.stringify(uuidDataParams))
      .then(res => res.json())
      .then(data => {
        const { status, entities, totalRecords } = data.response;
        let uuid;
        if (status === 'success' && totalRecords > 0 && entities?.length) {
          uuid = entities[0].id;
        }
        if (uuid) {
          postApiCall(urls.itemImageUrlCN, JSON.stringify(getImgDataParams(uuid)))
            .then(res => res.json())
            .then(imgResponseData => {
              const {
                status: imgStatus, entities: imgEntitites, totalRecords: imgTotalRecords
              } = imgResponseData.response;
              if (imgStatus === 'success' && imgTotalRecords > 0 && imgEntitites?.length) {
                const imageUri = imgEntitites[0].data.relationships
                  .hasimages[0].relTo.data.attributes.downloadURL.values[0].value;
                if (imageUri) {
                  setImageUri(imageUri);
                }
              }
            })
            // eslint-disable-next-line no-console
            .catch(error => console.log('❌ ', 'while fetching image using uuid ', error));
        }
      })
      // eslint-disable-next-line no-console
      .catch(error => console.log('❌ ', 'while fetching image uuid ', error));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('❌ ', 'error while fetching item image ', err);
  }
};

const ImageWrapper = ({
  itemNumber, imageStyle, countryCode
}: ImageWrapperProps) => {
  const [imageUri, setImageUri] = useState(
    countryCode === 'MX' ? getMXImageUri(itemNumber) : undefined
  );
  useEffect(() => {
    if (countryCode === 'CN') {
      getCNImageUri(itemNumber, setImageUri);
    }
  }, []);

  return (
    <View>
      <FastImage
        style={{ ...styles.image, ...imageStyle }}
        source={imageUri
          ? {
            uri: imageUri,
            priority: FastImage.priority.normal
          }
          : require('../../assets/images/placeholder.png')}
        resizeMode={FastImage.resizeMode.contain}
        onError={() => setImageUri(undefined)}
      />
    </View>
  );
};

export default ImageWrapper;

ImageWrapper.defaultProps = {
  imageStyle: {}
};
