import React from 'react';
import { Modal } from 'antd';

interface UniversalModalProps {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  onCancel?: () => void;
}

const UniversalModal: React.FC<UniversalModalProps> = ({
  open,
  title = 'Modal Title',
  children,
  onCancel
}) => {
  return (
    <Modal
      open={open}
      title={title}
      onCancel={onCancel}
      footer={false}
      centered={true}
    >
      {children}
    </Modal>
  );
};

export default UniversalModal;
