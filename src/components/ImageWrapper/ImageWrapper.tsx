import React, { useEffect, useLayoutEffect, useState } from 'react';
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
  imageToken?: string;
  tokenIsWaiting?: boolean;
  imageStyle?: any,
}

const urls: Environment = getEnvironment();

// eslint-disable-next-line max-len
export const getMXImageUri = (itemNumber: number) => `https://assets.sams.com.mx/image/upload/f_auto,q_auto:eco,w_350,c_scale,dpr_auto/mx/images/product-images/img_medium/${itemNumber}m.jpg`;

export const setCNImageUri = (
  itemNumber: number,
  setImageUri: React.Dispatch<React.SetStateAction<any>>,
  postApiCallCN: (apiUrl: string, data: any) => Promise<Response>
) => {
  const riversandParams = {
    param: {
      itemNbrs: [itemNumber]
    }
  };

  setImageUri('');
  postApiCallCN(urls.itemCenterRiversandURL, riversandParams)
    .then(res => res.json())
    .then(responseData => {
      const imageArray = responseData.data[0].data.relationShips.hasImages || [];
      const primaryImage = imageArray.find((imageElement: any) => imageElement.imageIsPrimary);
      if (primaryImage) {
        setImageUri(urls.itemCenterImageURL + primaryImage.walmartOssUploadId);
      }
    })
    // eslint-disable-next-line no-console
    .catch(error => console.log('❌ ', 'while fetching image uuid ', error));
};

export const createSource = (imageUri: string, countryCode: string, imageToken: string | undefined) => {
  if (countryCode === 'CN') {
    return {
      uri: imageUri,
      headers: {
        clientId: 'oyi',
        accessToken: imageToken
      },
      priority: FastImage.priority.normal
    };
  }
  return {
    uri: imageUri,
    priority: FastImage.priority.normal
  };
};

export const imageWrapperUseEffect = (
  itemNumber: number,
  countryCode: string,
  setImageUri: React.Dispatch<React.SetStateAction<string>>
) => {
  if (itemNumber > 0) {
    if (countryCode === 'CN') {
      setCNImageUri(itemNumber, setImageUri, postApiCall);
    } else {
      setImageUri(getMXImageUri(itemNumber));
    }
  } else {
    setImageUri('');
  }
};

const ImageWrapper = ({
  itemNumber, imageStyle, countryCode, imageToken, tokenIsWaiting
}: ImageWrapperProps) => {
  const [imageUri, setImageUri] = useState(countryCode === 'MX' ? getMXImageUri(itemNumber) : '');
  useLayoutEffect(() => {
    imageWrapperUseEffect(itemNumber, countryCode, setImageUri);
  }, [itemNumber]);
  return (
    <View>
      <FastImage
        style={{ ...styles.image, ...imageStyle }}
        source={imageUri !== '' && !tokenIsWaiting && imageToken
          ? createSource(imageUri, countryCode, imageToken)
          : require('../../assets/images/placeholder.png')}
        resizeMode={FastImage.resizeMode.contain}
        onError={() => setImageUri('')}
      />
    </View>
  );
};

export default ImageWrapper;

ImageWrapper.defaultProps = {
  imageToken: undefined,
  tokenIsWaiting: false,
  imageStyle: {}
};
