// ============================================================
// ArchMac — Dock v0 (Quickshell)
// Panel de vidrio flotante, iconos con magnificación al pasar el
// mouse y rebote al lanzar. Diseño: web/simulation (Dock.svelte).
// Tokens: design/tokens/tokens.json
// ============================================================
import QtQuick
import Quickshell
import Quickshell.Widgets

PanelWindow {
	id: root

	anchors {
		bottom: true
	}
	margins.bottom: 6
	color: "transparent"

	// Reserva de espacio bajo las ventanas (altura del panel + margen)
	exclusiveZone: panel.height + 10

	// --- Parámetros de diseño ---
	readonly property real baseSize: 48      // tamaño base del icono
	readonly property real maxBoost: 0.45    // magnificación máxima (45%)
	readonly property real influence: 110    // radio de influencia del cursor (px)
	readonly property int slotSpacing: 10

	// --- Apps fijadas (v0: lista estática; luego vendrá de un config) ---
	readonly property var apps: [
		{ name: "Archivos", icon: "org.gnome.Nautilus", cmd: ["nautilus", "--new-window"] },
		{ name: "Firefox", icon: "firefox", cmd: ["firefox"] },
		{ name: "Calendario", icon: "org.gnome.Calendar", cmd: ["gnome-calendar"] },
		{ name: "Calculadora", icon: "org.gnome.Calculator", cmd: ["gnome-calculator"] },
		{ name: "Editor", icon: "org.gnome.TextEditor", cmd: ["gnome-text-editor"] },
		{ name: "Terminal", icon: "kitty", cmd: ["kitty"] },
		{ name: "Apps", icon: "view-app-grid-symbolic", cmd: ["wofi", "--show", "drun"] }
	]

	implicitWidth: iconRow.width + 40
	implicitHeight: baseSize * (1 + maxBoost) + 34

	// Fondo de vidrio (el blur real lo aporta Hyprland vía layerrule)
	Rectangle {
		id: panel
		anchors.horizontalCenter: parent.horizontalCenter
		anchors.bottom: parent.bottom
		width: iconRow.width + 28
		height: baseSize + 16
		radius: 21
		color: Qt.rgba(0.11, 0.11, 0.13, 0.55)
		border.width: 1
		border.color: Qt.rgba(1, 1, 1, 0.14)
	}

	Row {
		id: iconRow
		anchors.horizontalCenter: parent.horizontalCenter
		anchors.bottom: parent.bottom
		anchors.bottomMargin: 12
		spacing: root.slotSpacing

		Repeater {
			model: root.apps

			delegate: Item {
				id: slot
				width: root.baseSize
				height: root.baseSize

				// Distancia del cursor al centro de este icono (campana gaussiana)
				readonly property real centerX: x + width / 2
				readonly property real dist: hoverArea.active
					? Math.abs((hoverArea.mouseX - iconRow.x) - centerX)
					: 1e9
				readonly property real boost:
					1 + root.maxBoost * Math.exp(-(dist * dist) / (2 * root.influence * root.influence))

				// Rebote al lanzar
				property real bounce: 0

				IconImage {
					id: icon
					anchors.horizontalCenter: parent.horizontalCenter
					anchors.bottom: parent.bottom
					anchors.bottomMargin: slot.bounce
					width: root.baseSize
					height: root.baseSize
					source: Quickshell.iconPath(modelData.icon, true)
					scale: slot.boost
					transformOrigin: Item.Bottom

					Behavior on scale {
						NumberAnimation { duration: 90; easing.type: Easing.OutQuad }
					}
				}

				// Etiqueta flotante al pasar el cursor
				Rectangle {
					visible: hoverArea.active && slot.dist < root.baseSize / 2
					anchors.horizontalCenter: parent.horizontalCenter
					anchors.bottom: parent.top
					anchors.bottomMargin: 16
					width: label.width + 18
					height: label.height + 8
					radius: 7
					color: Qt.rgba(0.11, 0.11, 0.13, 0.85)
					border.width: 1
					border.color: Qt.rgba(1, 1, 1, 0.12)

					Text {
						id: label
						anchors.centerIn: parent
						text: modelData.name
						color: "#f5f5f7"
						font.family: "Inter"
						font.pixelSize: 12
						font.weight: 600
					}
				}

				SequentialAnimation {
					id: bounceAnim
					NumberAnimation { target: slot; property: "bounce"; to: 22; duration: 160; easing.type: Easing.OutQuad }
					NumberAnimation { target: slot; property: "bounce"; to: 0; duration: 260; easing.type: Easing.OutBounce }
				}

				function launch() {
					bounceAnim.restart();
					Quickshell.execDetached(modelData.cmd);
				}
			}
		}
	}

	// Un solo MouseArea para magnificación + clics (evita conflictos de hover)
	MouseArea {
		id: hoverArea
		anchors.fill: parent
		hoverEnabled: true
		property bool active: containsMouse

		onClicked: (mouse) => {
			for (let i = 0; i < iconRow.children.length; i++) {
				const c = iconRow.children[i];
				if (!c || c.width === undefined || !c.launch) continue;
				const rx = mouse.x - iconRow.x;
				if (rx >= c.x && rx <= c.x + c.width) {
					c.launch();
					return;
				}
			}
		}
	}
}
