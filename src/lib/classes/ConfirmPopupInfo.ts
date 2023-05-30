type Action = () => Promise<void> | void

export default class ConfirmPopupInfo {
	private _actionOk: Action
	private _actionCancel: Action

	constructor(public show = false, public question = '', public description?: string) {
		this._actionOk = () => console.log('OK')
		this._actionCancel = () => console.log('Cancel')
	}

	public get actionOk(): Action {
		return this._actionOk
	}

	public set actionOk(action: Action) {
		this._actionOk = action
	}

	public get actionCancel(): Action {
		return this._actionCancel
	}

	public set actionCancel(action: Action) {
		this._actionCancel = action
	}

	public reset(show = false, question = '', description?: string, resetCancel = false) {
		this.show = show
		this.question = question
		this.description = description
		this.actionOk = () => console.log('OK')
		if (resetCancel) this.actionCancel = () => console.log('Cancel')
		return this
	}
}
