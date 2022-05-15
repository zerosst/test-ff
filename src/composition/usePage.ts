import { ObjectPageType } from '@/utils/constant/type'

// eslint-disable-next-line func-names
export default function (initData: ObjectPageType) {
  /** data start */
  const state = reactive<ObjectPageType>(initData)

  /** method start  */
  const isCurrentPage = (page: string): boolean => state.page === page

  const jumpPage = (data: ObjectPageType) => {
    const { page, type, id, row } = data
    Object.assign(state, { page, type, id, row })
  }
  /** method end */

  return {
    state,
    isCurrentPage,
    jumpPage
  }
}
