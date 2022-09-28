import TtestOnesampleHandler from './ttest-onesample.handler';

export default class TtestIndependentHandler extends TtestOnesampleHandler {
  public static readonly ALGO_NAME: string = 'ttest_independent';

  public get ALGO_NAME() {
    return TtestIndependentHandler.ALGO_NAME;
  }
}
