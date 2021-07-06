import { AsyncState } from '../models/AsyncState';

export const mockFailedData: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: {
    status: 207,
    data: {
      skippedItems: [],
      data: [{
        message: 'failure', id: 4785, itemNbr: 125, statusCode: 500
      }],
      metadata: {
        skipped: 0,
        failure: 1,
        success: 0,
        total: 1
      }
    }
  }
};
export const mockMixedData: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: {
    status: 207,
    data: {
      skippedItems: [],
      data: [{
        message: 'failure', id: 4785, itemNbr: 125, statusCode: 500
      }, {
        message: 'success', id: 4786, itemNbr: 126, statusCode: 200
      }, {
        message: 'success', id: 4787, itemNbr: 127, statusCode: 200
      }],
      metadata: {
        skipped: 0,
        failure: 1,
        success: 2,
        total: 3
      }
    }
  }
};
export const mockLargeFailedData: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: {
    status: 207,
    data: {
      skippedItems: [],
      data: [{
        message: 'failure', id: 4785, itemNbr: 125, statusCode: 500
      },
      {
        message: 'failure', id: 4786, itemNbr: 126, statusCode: 500
      },
      {
        message: 'failure', id: 4787, itemNbr: 127, statusCode: 500
      },
      {
        message: 'failure', id: 4788, itemNbr: 128, statusCode: 500
      },
      {
        message: 'failure', id: 4789, itemNbr: 129, statusCode: 500
      },
      {
        message: 'failure', id: 4790, itemNbr: 130, statusCode: 500
      }
      ],
      metadata: {
        skipped: 0,
        failure: 6,
        success: 0,
        total: 6
      }
    }
  }
};
export const mockSuccessSkippedData: AsyncState = {
  isWaiting: false,
  value: null,
  error: null,
  result: {
    status: 207,
    data: {
      skippedItems: [{
        id: 4783,
        itemNbr: 123
      }],
      data: [{
        message: 'success', id: 4785, itemNbr: 125, statusCode: 500
      }
      ],
      metadata: {
        skipped: 1,
        failure: 0,
        success: 1,
        total: 2
      }
    }
  }
};
