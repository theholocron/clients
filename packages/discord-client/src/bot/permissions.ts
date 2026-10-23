/**
 * Discord permission bits, by the names the Discord docs use. Permissions travel as
 * decimal strings because they overflow a JS number's safe integer range.
 */
export const Permission = {
	CreateInstantInvite: 1n << 0n,
	KickMembers: 1n << 1n,
	BanMembers: 1n << 2n,
	Administrator: 1n << 3n,
	ManageChannels: 1n << 4n,
	ManageGuild: 1n << 5n,
	AddReactions: 1n << 6n,
	ViewAuditLog: 1n << 7n,
	ViewChannel: 1n << 10n,
	SendMessages: 1n << 11n,
	SendTtsMessages: 1n << 12n,
	ManageMessages: 1n << 13n,
	EmbedLinks: 1n << 14n,
	AttachFiles: 1n << 15n,
	ReadMessageHistory: 1n << 16n,
	MentionEveryone: 1n << 17n,
	UseExternalEmojis: 1n << 18n,
	Connect: 1n << 20n,
	Speak: 1n << 21n,
	ChangeNickname: 1n << 26n,
	ManageNicknames: 1n << 27n,
	ManageRoles: 1n << 28n,
	ManageWebhooks: 1n << 29n,
	CreatePublicThreads: 1n << 35n,
	CreatePrivateThreads: 1n << 36n,
	SendMessagesInThreads: 1n << 38n,
	ModerateMembers: 1n << 40n,
} as const;

export type PermissionName = keyof typeof Permission;

/** The decimal-string bitfield Discord wants for the named permissions (`"0"` for none). */
export function permissions(names: readonly PermissionName[]): string {
	let bits = 0n;
	for (const name of names) {
		const bit = Permission[name];
		if (bit === undefined) throw new Error(`unknown Discord permission: ${JSON.stringify(name)}`);
		bits |= bit;
	}
	return bits.toString();
}

/** The permission names set in a bitfield, in declaration order (unknown bits are ignored). */
export function permissionNames(bitfield: string): PermissionName[] {
	if (!/^\d{1,20}$/.test(bitfield)) throw new Error(`invalid permission bitfield: ${JSON.stringify(bitfield)}`);
	const bits = BigInt(bitfield);
	return (Object.keys(Permission) as PermissionName[]).filter((name) => (bits & Permission[name]) !== 0n);
}
