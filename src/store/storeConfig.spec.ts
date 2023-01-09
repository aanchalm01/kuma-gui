import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { ActionHandler, ActionTree } from 'vuex'

import { State, storeConfig } from '@/store/storeConfig'
import { ClientStorage } from '@/utilities/ClientStorage'

describe('storeConfig', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  test.each([
    [[], null, null],
    [[{ name: 'test' }], null, 'test'],
    [[{ name: 'test' }], 'all', 'test'],
    [[{ name: 'test' }], 'outdated', 'test'],
  ])('bootstrap sets reasonable selected mesh as fallback', async (meshes, storedSelectedMesh, expectedSelectedMesh) => {
    const actions = storeConfig.actions as ActionTree<State, State>
    const bootstrap = actions.bootstrap as ActionHandler<State, State>

    const commit = jest.fn()
    const dispatch = jest.fn()
    const getters = {
      'config/getStatus': 'OK',
    }
    const state = {
      meshes: {
        items: meshes,
      },
    }

    jest.spyOn(ClientStorage, 'get').mockImplementation(() => storedSelectedMesh)

    // @ts-ignore go away
    await bootstrap({ commit, dispatch, getters, state })

    expect(dispatch).toHaveBeenLastCalledWith('updateSelectedMesh', expectedSelectedMesh)
  })
})