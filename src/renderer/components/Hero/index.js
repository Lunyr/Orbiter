import React from 'react';
import injectStyles from 'react-jss';
import cx from 'classnames';
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';
import { MdFileUpload as UploadIcon } from 'react-icons/md';
import { Button, ButtonGroup } from '../../components';
import ipfsConfig from '../../../shared/ipfs';
import styles from './styles';

class Hero extends React.PureComponent {
  state = {
    hovering: false,
    preview: null,
    loading: false,
    crop: false,
  };

  onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      if (this.state.preview) {
        window.URL.revokeObjectURL(this.state.preview);
      }
      this.setState({
        preview: acceptedFiles[0].preview,
        acceptedFile: acceptedFiles[0],
        crop: true,
      });
    }
  };

  /***
   * Converts data url to blob
   */
  dataURItoBlob = (dataURI) => {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    const byteString = atob(dataURI.split(',')[1]);
    // separate out the mime component
    const mimeString = dataURI
      .split(',')[0]
      .split(':')[1]
      .split(';')[0];
    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);
    // create a view into the buffer
    const ia = new Uint8Array(ab);
    // set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    // write the ArrayBuffer to a blob, and you're done
    return new Blob([ab], { type: mimeString });
  };

  /***
   * Crops the photo
   */
  crop = () => {
    if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }
    const dataUrl = this.cropper.getCroppedCanvas().toDataURL();
    const blob = this.dataURItoBlob(dataUrl);
    this.props.onSave(blob);
  };

  componentDidUpdate({ imageHash }) {
    if (this.props.imageHash !== imageHash && this.state.crop) {
      this.setState({
        hovering: false,
        preview: null,
        loading: false,
        crop: false,
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.showLoader);
    // Removes the preview of the upload from the memory
    if (this.state.preview) {
      window.URL.revokeObjectURL(this.state.preview);
    }
  }

  renderBaseImage = () => {
    const { classes, imageHash } = this.props;
    return imageHash ? (
      <img className={classes.hero__image} src={`${ipfsConfig.IPFS_URL}${imageHash}`} alt="Hero" />
    ) : (
      <img className={classes.hero__image} src={require('../../assets/images/placeholder.jpg')} />
    );
  };

  render() {
    const { classes, className, onSave } = this.props;
    const { crop, hovering, preview } = this.state;
    const baseImage = this.renderBaseImage();
    return (
      <section
        className={cx({ [classes.hero]: true, [className]: true, [classes.cropping]: crop })}>
        {/* Cropper */}
        {crop ? (
          <div className={classes.container}>
            <div className={classes.hero__actions}>
              <ButtonGroup>
                <Button
                  className={classes.crop__button}
                  theme="primary"
                  onClick={this.crop}
                  value="Crop"
                />
                <Button
                  className={classes.crop__button}
                  value="Cancel"
                  onClick={() => {
                    this.setState({ crop: false });
                  }}
                />
              </ButtonGroup>
            </div>
            <div className={classes.cropper__wrapper}>
              <Cropper
                ref={(ref) => (this.cropper = ref)}
                className={classes.cropper}
                src={preview}
                aspectRatio={4}
                guides={false}
              />
            </div>
          </div>
        ) : onSave ? (
          <Dropzone
            className={classes.dropzone}
            onDrop={this.onDrop}
            onDropRejected={this.onRejected}
            multiple={false}
            maxSize={2e6}
            accept="image/*"
            onMouseEnter={() => this.setState({ hovering: true })}
            onMouseLeave={() => this.setState({ hovering: false })}>
            <React.Fragment>
              {baseImage}
              {hovering && (
                <div className={classes.overlay}>
                  <UploadIcon size={50} />
                </div>
              )}
            </React.Fragment>
          </Dropzone>
        ) : (
          baseImage
        )}
      </section>
    );
  }
}

export default injectStyles(styles)(Hero);
