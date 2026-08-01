// ============================================================
// ArchMac — Barra superior v0 (Quickshell)
// Diseño: web/simulation (TopBar.svelte): logo, menús de app a la
// izquierda; estados y reloj a la derecha. Vidrio translúcido.
// v0: menús estáticos y estados decorativos; el reloj es real.
// ============================================================
import QtQuick
import Quickshell

PanelWindow {
	id: bar

	anchors {
		top: true
		left: true
		right: true
	}
	implicitHeight: 28
	exclusiveZone: 28
	color: "transparent"

	property date now: new Date()
	Timer {
		interval: 10000
		running: true
		repeat: true
		onTriggered: bar.now = new Date()
	}

	Rectangle {
		anchors.fill: parent
		color: Qt.rgba(0.11, 0.11, 0.13, 0.45)
	}

	// ----- Izquierda: logo + menús de la app -----
	Row {
		anchors.verticalCenter: parent.verticalCenter
		anchors.left: parent.left
		anchors.leftMargin: 16
		spacing: 20

		Text {
			text: ""
			color: "#f5f5f7"
			font.family: "Symbols Nerd Font"
			font.pixelSize: 15
			anchors.verticalCenter: parent.verticalCenter

			MouseArea {
				anchors.fill: parent
				anchors.margins: -6
				onClicked: Quickshell.execDetached(["wofi", "--show", "drun"])
			}
		}

		Text {
			text: "ArchMac"
			color: "#f5f5f7"
			font.family: "Inter"
			font.pixelSize: 13
			font.weight: 700
			anchors.verticalCenter: parent.verticalCenter
		}

		Repeater {
			model: ["Archivo", "Edición", "Ver", "Ir", "Ventana", "Ayuda"]
			delegate: Text {
				text: modelData
				color: "#f5f5f7"
				opacity: 0.92
				font.family: "Inter"
				font.pixelSize: 13
				font.weight: 500
				anchors.verticalCenter: parent.verticalCenter
			}
		}
	}

	// ----- Derecha: estados (los SVG propios de la simulación) + reloj -----
	Row {
		anchors.verticalCenter: parent.verticalCenter
		anchors.right: parent.right
		anchors.rightMargin: 16
		spacing: 15

		Image {
			source: Qt.resolvedUrl("assets/wifi.svg")
			sourceSize.height: 15
			sourceSize.width: 16
			anchors.verticalCenter: parent.verticalCenter
			smooth: true
		}

		Image {
			source: Qt.resolvedUrl("assets/battery.svg")
			sourceSize.height: 13
			sourceSize.width: 28
			anchors.verticalCenter: parent.verticalCenter
			smooth: true
		}

		Image {
			source: Qt.resolvedUrl("assets/spotlight.svg")
			sourceSize.height: 14
			sourceSize.width: 14
			anchors.verticalCenter: parent.verticalCenter
			smooth: true

			MouseArea {
				anchors.fill: parent
				anchors.margins: -6
				onClicked: Quickshell.execDetached(["wofi", "--show", "drun"])
			}
		}

		Text {
			// "vie 1 ago 21:50" — reloj real en español
			text: bar.now.toLocaleString(Qt.locale("es_ES"), "ddd d MMM  HH:mm").replace(/\./g, "")
			color: "#f5f5f7"
			font.family: "Inter"
			font.pixelSize: 13
			font.weight: 600
			anchors.verticalCenter: parent.verticalCenter
		}
	}
}
