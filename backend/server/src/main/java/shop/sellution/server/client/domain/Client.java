package shop.sellution.server.client.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import shop.sellution.server.client.domain.type.PermissionType;
import shop.sellution.server.company.domain.Company;
import shop.sellution.server.global.BaseEntity;
import shop.sellution.server.global.type.UserRole;


@Entity
@Table(name = "client")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString
public class Client extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "client_id")
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @NotNull
    @Column(name = "username", unique = true, length = 100)
    private String username;

    @NotNull
    @Column(name = "password", length = 100)
    private String password;

    @Column(name = "permissions")
    private int permissions = 0;

    @Builder
    public Client(Company company, String username, String password) {
        this.company = company;
        this.username = username;
        this.password = password;
    }

    public UserRole getUserRole() {
        return UserRole.ROLE_CLIENT;
    }

    public void addPermission(PermissionType permissionType) {
        this.permissions |= permissionType.getBit();
    }

    public void removePermission(PermissionType permissionType) {
        this.permissions &= ~permissionType.getBit();
    }

    public boolean hasPermission(PermissionType permissionType) {
        return (this.permissions & permissionType.getBit()) == permissionType.getBit();
    }

    public void changePassword(String newPassword) {
        this.password = newPassword;
    }
}
