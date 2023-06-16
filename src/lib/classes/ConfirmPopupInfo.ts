export type Action = () => Promise<void> | void

export default class ConfirmPopupInfo {
	private _actionOk: Action
	private _actionCancel: Action

	constructor(public show = false, public question = '', public description?: string) {
		this._actionOk = () => console.log('OK')
		this._actionCancel = () => this.reset()
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
		this._actionCancel = async () => {
			await Promise.resolve(action)
			this.reset()
		}
	}

	public reset() {
		this.show = false
		this.question = ''
		this.description = undefined
		this.actionOk = () => console.log('OK')
		this.actionCancel = () => this.reset()
	}
}
