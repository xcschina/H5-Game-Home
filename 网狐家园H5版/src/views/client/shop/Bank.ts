/**
 * 银行
 */
namespace shop {
    const BankOperateCode = {
        Flush: 0,
        Save: 1,
        Take: 2
    }

    export class Bank {
        //银行输入文本
        private _bankTextInput: eui.TextInput;
        private _bankFrame: frame.BankFrame;
        private _bankOperateCode: number = BankOperateCode.Save;
        private _viewFrame: any;
        private _view: eui.Component;
        constructor(viewFrame, companet) {
            this._viewFrame = viewFrame;
            this._view = companet;
            this.onInit();
        }

        onInit() {
            if (null == this._bankTextInput) {
                this._bankTextInput = this._view.getChildByName("textInput") as eui.TextInput;
                this._bankTextInput.inputType = egret.TextFieldInputType.TEL;
                this._bankTextInput.addEventListener(egret.Event.CHANGE, (e: egret.Event) => {

                }, this);
            }

            //取款
            let bt = this._view.getChildByName("take");
            bt.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonClickEvent, this);
            //存款
            bt = this._view.getChildByName("save");
            bt.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onButtonClickEvent, this);

            this.onUserWealth();
        }

        /**
         * 银行刷新
         */
        private _userScore: utils.LabelAtlas;
        private _userInsure: utils.LabelAtlas;
        public onUserWealth() {
            if (null == this._userScore) {
                const str = utils.StringUtils.formatNumberThousands(managers.FrameManager.getInstance().m_GlobalUserItem.lUserScore);
                this._userScore = utils.LabelAtlas.createLabel(str, "bank_num_png", ",0123456789", 34, 57);
                utils.setAnchorLeftMid(this._userScore);
                this._view.addChild(this._userScore);
                this._userScore.x = 274;
                this._userScore.y = 65;
            } else {
                const str = utils.StringUtils.formatNumberThousands(managers.FrameManager.getInstance().m_GlobalUserItem.lUserScore);
                this._userScore.setText(str)
            }

            if (null == this._userInsure) {
                const str = utils.StringUtils.formatNumberThousands(managers.FrameManager.getInstance().m_GlobalUserItem.lUserInsure);
                this._userInsure = utils.LabelAtlas.createLabel(str, "bank_num_png", ",0123456789", 34, 57);
                utils.setAnchorLeftMid(this._userInsure);
                this._view.addChild(this._userInsure);
                this._userInsure.x = 274;
                this._userInsure.y = 145;
            } else {
                const str = utils.StringUtils.formatNumberThousands(managers.FrameManager.getInstance().m_GlobalUserItem.lUserInsure);
                this._userInsure.setText(str)
            }
        }

        public onButtonClickEvent(e: egret.Event) {
            var target = e.target as eui.Button;

            let tw = egret.Tween.get(target)
                .to({ scaleX: 1.1, scaleY: 1.1 }, 50)
                .to({ scaleX: 1.0, scaleY: 1.0 }, 50);

            switch (target.name) {
                case "take":
                    {
                        if (this._bankTextInput.text.length == 0) {
                            managers.FrameManager.getInstance().showToast("请输入操作金额!");
                            return;
                        }

                        if (isNaN(Number(this._bankTextInput.text))) {
                            managers.FrameManager.getInstance().showToast("请输入合法金额!");
                            return;
                        }

                        if (Number(this._bankTextInput.text) > managers.FrameManager.getInstance().m_GlobalUserItem.lUserInsure) {
                            managers.FrameManager.getInstance().showToast("输入金额超过存款金额,请重新输入!");
                            return;
                        }

                        this._bankFrame = new frame.BankFrame(this);
                        this._bankOperateCode = BankOperateCode.Take;
                        managers.TcpServiceCtrl.getInstance().onConnectPlaza();
                        managers.TcpServiceCtrl.getInstance().setDelegate(this._bankFrame);
                       
                    }
                    break;
                case "save":
                    {
                        if (this._bankTextInput.text.length == 0) {
                            managers.FrameManager.getInstance().showToast("请输入操作金额!");
                            return;
                        }

                        if (isNaN(Number(this._bankTextInput.text))) {
                            managers.FrameManager.getInstance().showToast("请输入合法金额!");
                            return;
                        }

                        if (Number(this._bankTextInput.text) > managers.FrameManager.getInstance().m_GlobalUserItem.lUserScore) {
                            managers.FrameManager.getInstance().showToast("输入金额超过携带金额,请重新输入!");
                            return;
                        }

                        this._bankOperateCode = BankOperateCode.Save;
                        this._bankFrame = new frame.BankFrame(this);
                        managers.TcpServiceCtrl.getInstance().onConnectPlaza();
                        managers.TcpServiceCtrl.getInstance().setDelegate(this._bankFrame);

              
                    }
                    break;
            }
        }

        private connectComplete() {
            switch (this._bankOperateCode) {
                case BankOperateCode.Take:
                    {
                        this._bankFrame.sendTakeScore(managers.TcpServiceCtrl.getInstance().getTcpService(), Number(this._bankTextInput.text))
                    }
                    break;
                case BankOperateCode.Save:
                    {
                        this._bankFrame.sendSaveScore(managers.TcpServiceCtrl.getInstance().getTcpService(), Number(this._bankTextInput.text))
                    }
                    break;
            }

        }

    }
}